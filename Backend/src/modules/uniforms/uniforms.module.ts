import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uniform } from './entities/uniform.entity';
import { UniformsService } from './uniforms.service';
import { UniformsController } from './uniforms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Uniform])],
  providers: [UniformsService],
  controllers: [UniformsController],
  exports: [UniformsService],
})
export class UniformsModule {}
