import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetArticleModule } from 'src/articles/categories/pet/category.module';
import { PetPage0, PetPage1 } from 'src/common/entities/page.model';
import {
  PetPage0Schema,
  PetPage1Schema,
} from 'src/common/entities/page.schema';
import { PetAdoptionModule } from 'src/products/categories/pet/pet-adoption/category.module';
import { PetProductModule } from 'src/products/categories/pet/pet-product/category.module';

import { PetPage0Resolver } from './resolvers/page0.resolver';
import { PetPage1Resolver } from './resolvers/page1.resolver';
import { PetPage0Service } from './services/page0.service';
import { PetPage1Service } from './services/page1.service';

@Module({
  imports: [
    PetProductModule,
    PetAdoptionModule,
    PetArticleModule,
    MongooseModule.forFeature(
      [
        { name: PetPage0.name, schema: PetPage0Schema },
        { name: PetPage1.name, schema: PetPage1Schema },
      ],
      'petDB',
    ),
  ],
  providers: [
    PetPage0Resolver,
    PetPage0Service,
    PetPage1Resolver,
    PetPage1Service,
  ],
  exports: [PetPage0Service, PetPage1Service],
})
export class PetPageModule {}
