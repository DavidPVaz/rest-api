class Dao {
    constructor(model) {
        this.model = model;
    }

    getModel() {
        return this.model;
    }

    list() {
        return this.model.query();
    }

    findById(id) {
        return this.model.query().findById(id);
    }

    findBy(field, value) {
        return this.model.query().findOne(field, value);
    }

    create(txModel, model) {
        return txModel.query().insert(model);
    }

    edit(txModel, id, model) {
        return txModel.query().patch(model).where({ id });
    }

    delete(txModel, id) {
        return txModel.query().deleteById(id);
    }
}

export { Dao };
