import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetArticleModule } from 'src/articles/categories/pet/category.module';
import { PetPage0, PetPage1, PetPage2 } from 'src/common/entities/page.model';
import {
  PetPage0Schema,
  PetPage1Schema,
  PetPage2Schema,
} from 'src/common/entities/page.schema';
import { PetAdoptionModule } from 'src/products/categories/pet/pet-adoption/category.module';
import { PetProductModule } from 'src/products/categories/pet/pet-product/category.module';

import { PetPage0Resolver } from './resolvers/page0.resolver';
import { PetPage1Resolver } from './resolvers/page1.resolver';
import { PetPage2Resolver } from './resolvers/page2.resolver';
import { PetPage0Service } from './services/page0.service';
import { PetPage1Service } from './services/page1.service';
import { PetPage2Service } from './services/page2.service';

@Module({
  imports: [
    PetProductModule,
    PetAdoptionModule,
    PetArticleModule,
    MongooseModule.forFeature(
      [
        { name: PetPage0.name, schema: PetPage0Schema },
        { name: PetPage1.name, schema: PetPage1Schema },
        { name: PetPage2.name, schema: PetPage2Schema },
      ],
      'petDB',
    ),
  ],
  providers: [
    PetPage0Resolver,
    PetPage0Service,
    PetPage1Resolver,
    PetPage1Service,
    PetPage2Resolver,
    PetPage2Service,
  ],
  exports: [PetPage0Service, PetPage1Service, PetPage2Service],
})
export class PetPageModule {}
