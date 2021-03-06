const Util = {
  /**
   * Recursively merge Objects together. Used for merging Vue config files
   * Doesn't merge arrays, will copy it over without merging into the contents
   * @param  {Object} target The base object to merge onto
   * @param  {Object} merge  The object to merge from
   * @return {Object}        The merged object
   */
  mergeObjects: (target, merge) => {
    let merged = Object.assign({}, target);
    if (Util.isObject(target) && Util.isObject(merge)) {
      Object.keys(target).forEach(key => {
        if (Util.isObject(target[key])) {
          if (merge.hasOwnProperty(key))
            merged[key] = Util.mergeObjects(target[key], merge[key]);
        } else if (merge.hasOwnProperty(key)) {
          Object.assign(merged, { [key]: merge[key] });
        }
      });
    }
    return merged;
  },

  /**
   * Checks if the parameter is an Object
   * @param  {Mixed} target The parameter to test
   * @return {Boolean}
   */
  isObject: target => {
    return (
      target && typeof target === "object" && target.constructor === Object
    );
  },

  /**
   * Converts a string to Pascal case
   * @param  {String} str String to convert
   * @return {String}     Converted string
   */
  toPascalCase: str => {
    return str
      .toLowerCase()
      .split(" ")
      .map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join("");
  },

  /**
   * Converts a value to a boolean
   * @param  {Mixed} value
   * @return {Boolean}
   */
  toBool: value => {
    if (typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      else return false;
    }
    return value;
  }
};

export default Util;
