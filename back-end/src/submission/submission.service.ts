import { Injectable, NotFoundException } from '@nestjs/common';
import * as jsonFile from 'new.json';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultPeriodValues } from 'src/entities/resultPeriodValues.entity';
import { IsNull, Repository } from 'typeorm';
import { Result } from 'src/entities/result.entity';
import { WorkPackage } from 'src/entities/workPackage.entity';
import { Organization } from 'src/entities/organization.entity';
import { Period } from 'src/entities/period.entity';
import { Submission } from 'src/entities/submission.entity';
import { User } from 'src/entities/user.entity';
import { Phase } from 'src/entities/phase.entity';
import { Initiative } from 'src/entities/initiative.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Phase) private phaseRepository: Repository<Phase>,
    @InjectRepository(Initiative)
    private initiativeRepository: Repository<Initiative>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(WorkPackage)
    private workPackageRepository: Repository<WorkPackage>,
    @InjectRepository(Result) private resultRepository: Repository<Result>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
    @InjectRepository(ResultPeriodValues)
    private resultValuesRepository: Repository<ResultPeriodValues>,
  ) {}
  async findSubmissionsByInitiativeId(id) {
    return this.submissionRepository.find({
      where: { initiative: { id } },
      relations: ['user', 'phase'],
    });
  }
  async findSubmissionsById(id) {
    const sub_data = await this.submissionRepository.findOne({
      where: { id },
      relations: [
        'user',
        'phase',
        'phase.periods',
        'initiative',
        'results',
        'results.values',
        'results.workPackage',
        'results.values.period',
      ],
    });
    return { ...sub_data, consolidated: this.dataToPers(sub_data.results) };
  }
  async createNew(user_id, initiative_id, phase_id, json) {
    const submissionData = {
      toc_data: json,
    };
    const userObject = await this.userRepository.findOneBy({ id: user_id });
    const phaseObject = await this.phaseRepository.findOneBy({ id: phase_id });
    const initiativeObject = await this.initiativeRepository.findOneBy({
      id: initiative_id,
    });
    const newSubmission = this.submissionRepository.create(submissionData);
    newSubmission.user = userObject;
    newSubmission.phase = phaseObject;
    newSubmission.initiative = initiativeObject;
    const submissionObject = await this.submissionRepository.save(
      newSubmission,
      { reload: true },
    );
    let oldResults = await this.resultRepository.find({
      where: {
        initiative_id: initiative_id,
        submission: IsNull(),
      },
      relations: ['values', 'workPackage', 'values.period'],
    });
    oldResults;
    for (let result of oldResults) {
      delete result.id;
      result.submission = submissionObject;
      const values = result.values.map((d) => {
        delete d.id;
        return d;
      });
      const new_result = await this.resultRepository.save(result, {
        reload: true,
      });
      for (let value of values) {
        value.result = new_result;
        await this.resultValuesRepository.save(value);
      }
    }

    return this.submissionRepository.findOne({
      where: { id: submissionObject.id },
      relations: ['user', 'phase'],
    });
  }
  async importData() {
    const initiativeId = 1;
    const phaseId = 1;
    const userId = 1;

    const periodValues = jsonFile.perValues;
    const values = jsonFile.values;
    const organizationsIds = Object.keys(jsonFile.perValues);

    const userObject = await this.userRepository.findOneBy({ id: userId });
    const phaseObject = await this.phaseRepository.findOneBy({ id: phaseId });
    const initiativeObject = await this.initiativeRepository.findOneBy({
      id: initiativeId,
    });
    if (userObject == null) {
      return 'User not found';
    }
    if (phaseObject == null) {
      return 'Phase not found';
    }
    if (initiativeObject == null) {
      return 'Initiative not found';
    }

    const submissionData = {
      toc_data: null,
    };
    const newSubmission = this.submissionRepository.create(submissionData);
    newSubmission.user = userObject;
    newSubmission.phase = phaseObject;
    newSubmission.initiative = initiativeObject;
    const submissionObject = await this.submissionRepository.save(
      newSubmission,
    );

    organizationsIds.forEach(async (organizationId) => {
      let organizationObject = await this.organizationRepository.findOneBy({
        id: +organizationId,
      });

      if (organizationObject != null) {
        let workPackages = values[organizationId];
        let workPackagesIds = Object.keys(workPackages);

        workPackagesIds.forEach(async (workPackageId) => {
          let workPackageObject = await this.workPackageRepository.findOneBy({
            wp_id: +workPackageId,
          });
          if (workPackageObject != null) {
            let results = workPackages[workPackageId];
            let resultsUuids = Object.keys(results);

            resultsUuids.forEach(async (resultUuid) => {
              let resultValue = results[resultUuid];
              let resultData = {
                result_uuid: resultUuid,
                value: resultValue,
              };
              let newResult = this.resultRepository.create(resultData);
              newResult.organization = organizationObject;
              newResult.workPackage = workPackageObject;
              newResult.submission = submissionObject;
              let resultObject = await this.resultRepository.save(newResult);

              let periodsValues =
                periodValues[organizationId][workPackageId][resultUuid];
              let periodsIds = Object.keys(periodsValues);

              periodsIds.forEach(async (periodId) => {
                let periodObject = await this.periodRepository.findOneBy({
                  id: +periodId,
                });
                if (periodObject != null) {
                  let resultPeriodValueData = {
                    value: periodsValues[periodId],
                  };

                  let newResultPeriodValue = this.resultValuesRepository.create(
                    resultPeriodValueData,
                  );
                  newResultPeriodValue.period = periodObject;
                  newResultPeriodValue.result = resultObject;
                  this.resultValuesRepository.save(newResultPeriodValue);
                }
              });
            });
          }
        });
      }
    });
  }

  dataToPers(saved_data) {
    let data = { perValues: {}, values: {} };
    saved_data.forEach((result: Result) => {
      if (!data.perValues[result.organization_id])
        data.perValues[result.organization_id] = {};
      if (
        !data.perValues[result.organization_id][
          result.workPackage.wp_official_code
        ]
      )
        data.perValues[result.organization_id][
          result.workPackage.wp_official_code
        ] = {};

      if (
        !data.perValues[result.organization_id][
          result.workPackage.wp_official_code
        ][result.result_uuid]
      )
        data.perValues[result.organization_id][
          result.workPackage.wp_official_code
        ][result.result_uuid] = {};
      result.values.forEach((d) => {
        if (
          data.perValues[result.organization_id][
            result.workPackage.wp_official_code
          ][result.result_uuid][d.period.id]
        )
          data.perValues[result.organization_id][
            result.workPackage.wp_official_code
          ][result.result_uuid][d.period.id] = {};
        data.perValues[result.organization_id][
          result.workPackage.wp_official_code
        ][result.result_uuid][d.period.id] = d.value;
      });

      if (!data.values[result.organization_id])
        data.values[result.organization_id] = {};
      if (
        !data.values[result.organization_id][
          result.workPackage.wp_official_code
        ]
      )
        data.values[result.organization_id][
          result.workPackage.wp_official_code
        ] = {};

      if (
        !data.values[result.organization_id][
          result.workPackage.wp_official_code
        ][result.result_uuid]
      )
        data.values[result.organization_id][
          result.workPackage.wp_official_code
        ][result.result_uuid] = result.value;
    });
    return data;
  }
  async getSaved(id) {
    const saved_data = await this.resultRepository.find({
      where: { initiative_id: id },
      relations: ['values', 'workPackage', 'values.period'],
    });
    return this.dataToPers(saved_data);
  }
  async saveResultData(id, data: any) {
    const initiativeId = id;
    const phaseId = 1;
    const userId = 1;

    const { partner_code, wp_id, item_id, per_id, value } = data;

    const userObject = await this.userRepository.findOneBy({ id: userId });
    const phaseObject = await this.phaseRepository.findOneBy({ id: phaseId });
    const initiativeObject = await this.initiativeRepository.findOneBy({
      id: initiativeId,
    });
    let workPackageObject = await this.workPackageRepository.findOneBy({
      wp_official_code: wp_id,
    });
    let organizationObject = await this.organizationRepository.findOneBy({
      id: +partner_code,
    });

    let oldResult = await this.resultRepository.findOneBy({
      initiative_id: id,
      result_uuid: item_id,
      organization: organizationObject,
      workPackage: workPackageObject,
      submission: IsNull(),
    });
    console.log(oldResult);
    let resultData = {
      result_uuid: item_id,
      value: 0,
    };

    if (organizationObject != null) {
      let resultObject;
      if (!oldResult) {
        let newResult = this.resultRepository.create(resultData);
        newResult.organization = organizationObject;
        newResult.workPackage = workPackageObject;
        newResult.initiative = initiativeObject;
        resultObject = await this.resultRepository.save(newResult);
      } else resultObject = oldResult;

      let periodObject = await this.periodRepository.findOneBy({
        id: +per_id,
      });

      let newResultPeriodValue: any;

      newResultPeriodValue = await this.resultValuesRepository.findOneBy({
        result: resultObject,
        period: periodObject,
      });
      if (!newResultPeriodValue)
        newResultPeriodValue = this.resultValuesRepository.create();

      newResultPeriodValue.value = value;
      newResultPeriodValue.period = periodObject;
      newResultPeriodValue.result = resultObject;
      await this.resultValuesRepository.save(newResultPeriodValue);
    }

    return { message: 'Data saved' };
  }
  async saveResultDataValue(id, data: any) {
    const initiativeId = id;

    const { partner_code, wp_id, item_id, per_id, value } = data;

    let organizationObject = await this.organizationRepository.findOneBy({
      id: +partner_code,
    });
    let workPackageObject = await this.workPackageRepository.findOneBy({
      wp_official_code: wp_id,
    });

    const initiativeObject = await this.initiativeRepository.findOneBy({
      id: initiativeId,
    });
    let oldResult = await this.resultRepository.findOneBy({
      initiative_id: id,
      result_uuid: item_id,
      organization: organizationObject,
      workPackage: workPackageObject,
      submission: IsNull(),
    });

    if (oldResult) {
      oldResult.value = value;
      await this.resultRepository.save(oldResult);
    } else throw new NotFoundException();

    return { message: 'Data saved' };
  }
}
