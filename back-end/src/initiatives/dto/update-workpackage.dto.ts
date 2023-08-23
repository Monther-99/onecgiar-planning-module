import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkPackageDto } from './create-workpackage.dto';

export class UpdateWorkPackageDto extends PartialType(CreateWorkPackageDto) {}
