const internals = {};

internals.removeFields = (fieldsToRemove, targetObject) =>
    Object.keys(targetObject).forEach(key => {
        if (fieldsToRemove.includes(key)) {
            delete targetObject[key];
        }
        if (targetObject[key] !== null && typeof targetObject[key] === 'object') {
            internals.removeFields(fieldsToRemove, targetObject[key]);
        }
    });

const OmitQueryBuilderMixin = QueryBuilder =>
    class extends QueryBuilder {
        omit(fields) {
            fields = Array.isArray(fields) ? fields : [fields];

            this.runAfter(models => {
                if (!models) {
                    return;
                }

                Array.isArray(models)
                    ? models.forEach(model => {
                          internals.removeFields(fields, model);
                      })
                    : internals.removeFields(fields, models);

                return models;
            });

            return this;
        }
    };

module.exports = OmitQueryBuilderMixin;
