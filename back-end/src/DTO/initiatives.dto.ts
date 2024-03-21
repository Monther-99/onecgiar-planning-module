import { ApiProperty } from '@nestjs/swagger';
import { Initiative } from 'src/entities/initiative.entity';

export class importInitiatives {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    short_name: string;
    @ApiProperty()
    official_code: string;
    @ApiProperty()
    active: boolean;
    @ApiProperty()
    status: string
    @ApiProperty()
    stageId: number;
    @ApiProperty()
    description: string;
    @ApiProperty()
    action_area_id: number;
    @ApiProperty()
    action_area_description: string;
    @ApiProperty()
    stages: Array<stages>
}

export class stages {
    @ApiProperty()
    id: number;
    @ApiProperty()
    initvStgId: number;
    @ApiProperty()
    stageId: number;
    @ApiProperty()
    active: boolean;
    
}

export class importInitiativeswp {
    @ApiProperty()
    initiative_id: number;
    @ApiProperty()
    initiative_offical_code: string;
    @ApiProperty()
    stage_id: number;
    @ApiProperty()
    initiative_status: boolean;
    @ApiProperty()
    wp_official_code: number;
    @ApiProperty()
    wp_id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    acronym: string;
    @ApiProperty()
    results: string;
    @ApiProperty()
    pathway_content: string;
    @ApiProperty()
    is_global: boolean;
    @ApiProperty()
    status: boolean;
    @ApiProperty()
    countries: [
    {
    id: number;
    iso_alpha_2: string;
    name: string
    }
    ];
    @ApiProperty()
    regions: [
    {
        id: number;
        name: string
    }
    ]
}


export class getInitiatives {

    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    active: boolean;
    @ApiProperty()
    status: boolean;
    @ApiProperty()
    stageId: number;
    @ApiProperty()
    short_name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    official_code: string
    @ApiProperty()
    action_area_id: number;
    @ApiProperty()
    action_area_description: string
    @ApiProperty()
    last_update_at: Date;
    @ApiProperty()
    last_submitted_at: Date;
    @ApiProperty()
    latest_submission_id: number;
}


export class createRoleResponse {
    @ApiProperty()
    initiative_id: number;
    @ApiProperty()
    id: number;
    @ApiProperty()
    user_id: number;
    @ApiProperty()
    email: string;
    @ApiProperty()
    role: string;
    @ApiProperty()
    organizations: string;
    @ApiProperty()
    updatedAt: Date;
    @ApiProperty()
    createdAt: Date;
}

export class createRoleReq {
    @ApiProperty()
    initiative_id: number;
    @ApiProperty()
    user_id: number;
    @ApiProperty()
    email: string;
    @ApiProperty()
    role: string;
    @ApiProperty()
    organizations: string;
}




export class updateRoleReq {
    @ApiProperty()
    id: number;
    @ApiProperty()
    initiative_id: number;
    @ApiProperty()
    user_id: number;
    @ApiProperty()
    email: string;
    @ApiProperty()
    role: string;
    @ApiProperty()
    organizations: string;
}


export class updateRoleResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    initiative_id: number;
    @ApiProperty()
    user_id: number;
    @ApiProperty()
    email: string;
    @ApiProperty()
    role: string;
    @ApiProperty()
    organizations: string;
    @ApiProperty()
    updatedAt: Date;
}
