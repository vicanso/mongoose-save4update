/**
 * 记录mongoose通过save的更新操作
 */
const defaultIgnoreKeys = ['updatedAt'];

module.exports = function saveForUpdate(schema, options = {}) {
  const ignoreKeys = options.ignoreKeys || defaultIgnoreKeys;
  const collection = options.collection || 'unknown';
  schema.post('init', function postInit(doc) {
    // 记录原始数据
    // eslint-disable-next-line
    this.__original = doc.toJSON();
  });

  schema.pre('save', function preSave(next) {
    // eslint-disable-next-line
    const originalData = this.__original;
    // 如果是新创建的数据，不记录
    if (this.isNew || !originalData || !this.isModified()) {
      next();
      return;
    }
    // eslint-disable-next-line
    const modify = this.$__.activePaths.states.modify;
    const current = this.toJSON();
    const updated = {};
    const original = {};
    Object.keys(modify).forEach(k => {
      const v = modify[k];
      if (!v || ignoreKeys.includes(k)) {
        return;
      }
      updated[k] = current[k];
      original[k] = originalData[k];
    });
    schema.emit(
      'save4update',
      {
        updated,
        original,
        collection,
      },
      this,
    );
    next();
  });
};
