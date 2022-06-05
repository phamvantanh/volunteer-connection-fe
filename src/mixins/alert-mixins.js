import Vue from "vue";
import _ from 'lodash';

export default {
  methods: {
    successAlert (message) {
      Vue.$toast.success(message);
    },

    errorAlert (message) {
      Vue.$toast.error(message);
    },

    warningAlert (message) {
      Vue.$toast.warning(message);
    },

    cloneDeep (item) {
      return _.cloneDeep(item)
    },

    replaceString (string, character, formatString) {
      return _.replace(string, character, formatString)
    },

    trim (item) {
      return _.trim(item)
    },

    startsWithoutSpace(item){
      return _.startsWith(item," ")
    },

    size(item){
      return _.size(item)
    }




  }
}
