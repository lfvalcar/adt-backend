import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInventoryDto {

    // General
    @IsString()
    computerName: string;

    @IsString()
    osVersion: string;

    @IsString()
    operatingSystem: string;

    // RAM
    @IsNumber()
    totalPhysicalMemoryGB: number;

    // CPU
    @IsNumber()
    processorCores: number;

    @IsString()
    processorModel: string;

    @IsNumber()
    processorArchitecture: number;

    @IsNumber()
    processorThreads: number;

    @IsNumber()
    processorClockSpeedGHz: number;

    // NET
    @IsString()
    ipAddress: string;

    @IsString()
    macAddress: string;

    @IsString()
    @IsOptional()
    networkAdapterDescription?: string;

    // STORAGE
    @IsNumber()
    freeDiskSpaceGB: number;

    @IsNumber()
    usedDiskSpaceGB: number;

    @IsString()
    diskModel: string;

    @IsNumber()
    totalDiskSpaceGB: number;



}
