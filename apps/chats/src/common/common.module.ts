import {Module} from '@nestjs/common';
import {ConfigurationModule} from './configurations.module';
import {TypeOrmCustomModule} from './typeorm.module';
import {EventEmitterCustomModule} from "./emitter.module";

@Module({
    imports: [
        TypeOrmCustomModule, ConfigurationModule,EventEmitterCustomModule
    ],
    exports: [
        TypeOrmCustomModule, ConfigurationModule,EventEmitterCustomModule,
    ]
})
export class CommonModule {
}

