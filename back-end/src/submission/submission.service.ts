import { Injectable, NotFoundException } from '@nestjs/common';
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
import { CenterStatus } from 'src/entities/center-status.entity';
import { WpBudget } from 'src/entities/wp-budget.entity';

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
    @InjectRepository(CenterStatus)
    private centerStatusRepo: Repository<CenterStatus>,
    @InjectRepository(WpBudget)
    private wpBudgetRepository: Repository<WpBudget>,
  ) {}
  sort(query) {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return { id: 'DESC' };
}
  async updateCenterStatus(data) {
    const { initiative_id, organization_code, status } = data;

    let center_status: CenterStatus;
    center_status = await this.centerStatusRepo.findOneBy({
      initiative_id,
      organization_code,
    });
    if (!center_status) center_status = this.centerStatusRepo.create();
    center_status.initiative_id = initiative_id;
    center_status.organization_code = organization_code;
    center_status.status = status;
    await this.centerStatusRepo.save(center_status);

    return { message: 'Data Saved' };
  }
  async updateStatusBySubmittionID(id, data) {
    return this.submissionRepository.update(id, data);
  }
  async findSubmissionsByInitiativeId(id, query:any) {
    if(query.withFilters == 'false') {
      return this.submissionRepository.find({
        where: { initiative: { id } },
        relations: ['user', 'phase'],
        order: { id: 'DESC' },
      });
    } else {
        const take = query.limit || 10;
        const skip = (Number(query.page || 1) - 1) * take;
        const [result, total] = await this.submissionRepository.findAndCount({
          where: { 
            initiative: { id },
            phase: {
              id: query?.phase,
              reportingYear: query?.reportingYear
            },
            status: query?.status,
            user: {
              id: query?.createdBy
            }
          },
          relations: ['user', 'phase'],
          take: take,
          skip: skip,
          order: { ...this.sort(query) },
        });
        return {
          result: result,
          count: total
      }
    }
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

    let oldWpBudgets = await this.wpBudgetRepository.find({
      where: {
        initiative_id: initiative_id,
        submission: IsNull(),
      },
    });
    for (let wpBudget of oldWpBudgets) {
      delete wpBudget.id;
      wpBudget.submission_id = submissionObject.id;
      await this.wpBudgetRepository.save(wpBudget, {
        reload: true,
      });
    }

    const date = new Date();
    await this.initiativeRepository.update(initiative_id, {
      last_update_at: date,
      last_submitted_at: date,
      latest_submission_id: submissionObject.id,
    });
    return this.submissionRepository.findOne({
      where: { id: submissionObject.id },
      relations: ['user', 'phase'],
    });
  }

  dataToPers(saved_data) {
    let data = { perValues: {}, values: {}, no_budget: {} };
    saved_data.forEach((result: Result) => {
      if (!data.perValues[result.organization_code])
        data.perValues[result.organization_code] = {};
      if (
        !data.perValues[result.organization_code][
          result.workPackage.wp_official_code
        ]
      )
        data.perValues[result.organization_code][
          result.workPackage.wp_official_code
        ] = {};

      if (
        !data.perValues[result.organization_code][
          result.workPackage.wp_official_code
        ][result.result_uuid]
      )
        data.perValues[result.organization_code][
          result.workPackage.wp_official_code
        ][result.result_uuid] = {};
      result.values.forEach((d) => {
        if (
          data.perValues[result.organization_code][
            result.workPackage.wp_official_code
          ][result.result_uuid][d.period.id]
        )
          data.perValues[result.organization_code][
            result.workPackage.wp_official_code
          ][result.result_uuid][d.period.id] = {};
        data.perValues[result.organization_code][
          result.workPackage.wp_official_code
        ][result.result_uuid][d.period.id] = d.value;
      });

      if (!data.values[result.organization_code])
        data.values[result.organization_code] = {};
      if (
        !data.values[result.organization_code][
          result.workPackage.wp_official_code
        ]
      )
        data.values[result.organization_code][
          result.workPackage.wp_official_code
        ] = {};

      if (
        !data.values[result.organization_code][
          result.workPackage.wp_official_code
        ][result.result_uuid]
      )
        data.values[result.organization_code][
          result.workPackage.wp_official_code
        ][result.result_uuid] = result.value;

      if (!data.no_budget[result.organization_code])
        data.no_budget[result.organization_code] = {};
      if (
        !data.no_budget[result.organization_code][
          result.workPackage.wp_official_code
        ]
      )
        data.no_budget[result.organization_code][
          result.workPackage.wp_official_code
        ] = {};
      if (
        !data.no_budget[result.organization_code][
          result.workPackage.wp_official_code
        ][result.result_uuid]
      )
        data.no_budget[result.organization_code][
          result.workPackage.wp_official_code
        ][result.result_uuid] = result.no_budget;
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
    const { partner_code, wp_id, item_id, per_id, value } = data;

    const initiativeObject = await this.initiativeRepository.findOneBy({
      id: initiativeId,
    });
    let workPackageObject = await this.workPackageRepository.findOneBy({
      wp_official_code: wp_id,
    });
    let organizationObject = await this.organizationRepository.findOneBy({
      code: partner_code,
    });

    let oldResult = await this.resultRepository.findOneBy({
      initiative_id: id,
      result_uuid: item_id,
      organization: organizationObject,
      workPackage: workPackageObject,
      submission: IsNull(),
    });

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
    await this.initiativeRepository.update(initiativeId, {
      last_update_at: new Date(),
    });
    return { message: 'Data saved' };
  }
  async saveResultDataValue(id, data: any) {
    const initiativeId = id;

    const {
      partner_code,
      wp_id,
      item_id,
      percent_value,
      budget_value,
      no_budget,
    } = data;

    let organizationObject = await this.organizationRepository.findOneBy({
      code: partner_code,
    });
    let workPackageObject = await this.workPackageRepository.findOneBy({
      wp_official_code: wp_id,
    });

    let oldResult = await this.resultRepository.findOneBy({
      initiative_id: id,
      result_uuid: item_id,
      organization: organizationObject,
      workPackage: workPackageObject,
      submission: IsNull(),
    });

    if (oldResult) {
      oldResult.value = percent_value;
      oldResult.budget = budget_value;
      oldResult.no_budget = no_budget;
      await this.resultRepository.save(oldResult);
    } else throw new NotFoundException();

    await this.initiativeRepository.update(initiativeId, {
      last_update_at: new Date(),
    });
    return { message: 'Data saved' };
  }

  async saveWpBudget(initiativeId: number, data: any) {
    const { partner_code, wp_id, budget } = data;

    let workPackageObject = await this.workPackageRepository.findOneBy({
      wp_official_code: wp_id,
    });

    let oldWpBudget = await this.wpBudgetRepository.findOneBy({
      initiative_id: initiativeId,
      organization_code: partner_code,
      wp_id: workPackageObject.wp_id,
      submission_id: IsNull(),
    });

    if (oldWpBudget) {
      oldWpBudget.budget = budget;
      await this.wpBudgetRepository.save(oldWpBudget);
    } else {
      const data: any = {
        initiative_id: initiativeId,
        organization_code: partner_code,
        wp_id: workPackageObject.wp_id,
        budget: budget,
        submission_id: null,
      };

      const newWpBudget = this.wpBudgetRepository.create(data);
      this.wpBudgetRepository.save(newWpBudget);
    }

    await this.initiativeRepository.update(initiativeId, {
      last_update_at: new Date(),
    });
    return { message: 'Data saved' };
  }

  async getWpsBudgets(initiative_id: number) {
    const wpBudgets = await this.wpBudgetRepository.find({
      where: { initiative_id },
      relations: ['workPackage'],
    });

    let data = {};
    wpBudgets.forEach((element) => {
      if (!data[element.organization_code]) data[element.organization_code] = {};

      data[element.organization_code][element.workPackage.wp_official_code] =
        element.budget;
    });

    return data;
  }

  async getSubmissionBudgets(submission_id: number) {
    const wpBudgets = await this.wpBudgetRepository.find({
      where: { submission_id },
      relations: ['workPackage'],
    });

    let data = {};
    wpBudgets.forEach((element) => {
      if (!data[element.organization_code]) data[element.organization_code] = {};

      data[element.organization_code][element.workPackage.wp_official_code] =
        element.budget;
    });

    return data;
  }
}
