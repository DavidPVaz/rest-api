const TestRunner = require('test/fixtures/test-runner');
const BaseModel = require('models/base');
const PermissionModel = require('models/authorization/permission');

const { describe, it, expect } = (exports.lab = TestRunner.script());

describe('Model: permission', () => {
    it('extends from base model', () => {
        // exercise
        const permissionModel = new PermissionModel();

        // verify
        expect(permissionModel).to.be.an.instanceof(BaseModel);
    });

    it('should persist to a table named permission', () => {
        expect(PermissionModel.tableName).to.equals('permissions');
    });

    it('should contain a schema', () => {
        expect(PermissionModel.jsonSchema).to.be.an.object();
    });

    it('should contain has-one relation mappings to resource model', () => {
        expect(PermissionModel.relationMappings).to.be.an.object();
        expect(PermissionModel.relationMappings.resource).to.exist();
        expect(PermissionModel.relationMappings.resource.relation).to.equals(
            BaseModel.BelongsToOneRelation
        );
    });

    it('should contain many-to-many relation mappings to role model', () => {
        expect(PermissionModel.relationMappings).to.be.an.object();
        expect(PermissionModel.relationMappings.roles).to.exist();
        expect(PermissionModel.relationMappings.roles.relation).to.equals(
            BaseModel.ManyToManyRelation
        );
    });
});
