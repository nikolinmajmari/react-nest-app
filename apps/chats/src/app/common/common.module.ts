import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configurations.module';
import { TypeOrmCustomModule } from './typeorm.module';

@Module({
    imports:[
        TypeOrmCustomModule,ConfigurationModule
    ],
    exports:[
        TypeOrmCustomModule,ConfigurationModule
    ]
})
export class CommonModule {}
