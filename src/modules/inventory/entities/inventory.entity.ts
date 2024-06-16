import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
    name: 'INVENTORY',
  })
export class Inventory {

    @PrimaryColumn({
        unique: true,
      })
      computerName: string;
    
      @Column()
      osVersion: string;
    
      @Column()
      operatingSystem: string;

      @Column()
      totalPhysicalMemoryGB: number;

      @Column()
      processorCores: number;

      @Column()
      processorArchitecture: number;

      @Column()
      processorThreads: number;

      @Column()
      processorClockSpeedGHz: number;

      @Column()
      processorModel: string;
    
      @Column()
      ipAddress: string;

      @Column()
      macAddress: string;

      @Column({nullable: true})
      networkAdapterDescription?: string;

      @Column()
      freeDiskSpaceGB: number;

      @Column()
      usedDiskSpaceGB: number;

      @Column()
      diskModel: string;

      @Column()
      totalDiskSpaceGB: number;
}
