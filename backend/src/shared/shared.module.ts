import { Global, Module } from "@nestjs/common";
import { PaginationService } from "./services/pagination.service";
import { DatabaseService } from "./services/database.service";
import { EntityVerifierService } from "./services/entity-verifier.service";

@Global()
@Module({
  providers: [PaginationService, DatabaseService, EntityVerifierService],
  exports: [PaginationService, DatabaseService, EntityVerifierService],
})
export class SharedModule {}
