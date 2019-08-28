import UbiNotifyComponent from "./components/UbiNotify";
import Util from "./utils";
import Config from "./configs";

const UbiNotify = {
  installed: false,
  notifiers: [],

  install: (Vue, options = null) => {
    if (UbiNotify.installed) return;
    UbiNotify.installed = true;

    // Register component
    Vue.component(UbiNotifyComponent.name, UbiNotifyComponent);

    // Add the notify method to the Vue instance
    Vue.prototype.$notify = UbiNotify.notify;

    // Add the register method to the Vue instance.
    // This lets components register themselves
    Vue.prototype.$UbiNotifyRegister = UbiNotify.registerComponent;

    // Add the notifiers registry to the Vue instance
    //Vue.prototype.$UbiNotifyRegistry = UbiNotify.notifiers;

    // Initialise the options then create and add our components
    UbiNotify.init(Vue, UbiNotifyComponent, options);
  },

  init: (Vue, componentObject, options) => {
    // Initialise options
    options = UbiNotify.initOptions(options);

    options.forEach(optionObject => {
      // Initialise then mount each component to the DOM;
      if (Util.isObject(optionObject)) {
        const component = UbiNotify.initComponent(
          Vue,
          componentObject,
          optionObject
        );
        //UbiNotify.registerComponent(component);
        UbiNotify.mountComponent(component, optionObject.parentNode);
      }
    });
  },

  initOptions: options => {
    // The user can pass multiple options objects in an array
    // Check to see if an array has been passed and create one if not
    if (options) {
      if (!Array.isArray(options) && Util.isObject(options)) {
        // User has passed a single object
        // Merge with our default options and put it in an array
        options = [Util.mergeObjects(Config.Default, options)];
      } else if (Array.isArray(options)) {
        // Loop through array and merge the configs with our default options
        const mergedOptions = [];
        options.forEach(optionObject => {
          mergedOptions.push(Util.mergeObjects(Config.Default, optionObject));
        });
        options = mergedOptions;
      }
    } else {
      options = [Config.Default];
    }
    return options;
  },

  initComponent: (Vue, component, options) => {
    return new Vue(
      Object.assign(component, {
        propsData: options
      })
    );
  },

  registerComponent: component => {
    UbiNotify.notifiers.push(component);
  },

  mountComponent: (component, node = null) => {
    if (!node) node = document.body.appendChild(document.createElement("div"));
    else {
      node = document
        .getElementById(node)
        .appendChild(document.createElement("div"));
    }
    node.className = "ubi-notify-wrapper";
    return component.$mount(node);
  },

  notify: (
    messageBody,
    messageHeading = null,
    messageType = null,
    componentName = null,
    duration = null
  ) => {
    if (UbiNotify.notifiers.length > 0) {
      const targetUbiNotify = UbiNotify.notifiers.find(
        component => component.name == componentName
      );
      if (typeof targetUbiNotify !== "undefined") {
        targetUbiNotify.addNotification(
          messageBody,
          messageHeading,
          messageType,
          duration
        );
      } else {
        // send to all the components if target is not specified or found
        UbiNotify.notifiers.forEach(component =>
          component.addNotification(
            messageBody,
            messageHeading,
            messageType,
            duration
          )
        );
      }
    }
  }
};

export default UbiNotify;
