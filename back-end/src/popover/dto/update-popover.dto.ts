import { PartialType } from '@nestjs/mapped-types';
import { CreatePopoverDto } from './create-popover.dto';

export class UpdatePopoverDto extends PartialType(CreatePopoverDto) {}
