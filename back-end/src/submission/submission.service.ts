import { Injectable } from '@nestjs/common';
import * as jsonFile from 'new.json';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultPeriodValues } from 'src/entities/resultPeriodValues.entity';
import { Repository } from 'typeorm';
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
      json_file: null,
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
}
