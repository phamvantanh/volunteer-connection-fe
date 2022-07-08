import Vue from "vue";
import _ from 'lodash';
import { mapActions } from 'vuex'
import AUTHENTICATION_ACTIONS from '../store/authentication-actions'
export default {
  methods: {
    ...mapActions({
      $_hideLoadingOverlay: AUTHENTICATION_ACTIONS.hideLoadingOverlay,
      $_showLoadingOverlay: AUTHENTICATION_ACTIONS.showLoadingOverlay
    }),
    showLoadingOverlay() {
      this.$_showLoadingOverlay()
    },

    hideLoadingOverlay() {
      this.$_hideLoadingOverlay()
    },

    successAlert(message) {
      Vue.$toast.success(message);
    },

    errorAlert(message) {
      Vue.$toast.error(message);
    },

    warningAlert(message) {
      Vue.$toast.warning(message);
    },

    cloneDeep(item) {
      return _.cloneDeep(item)
    },

    replaceString(string, character, formatString) {
      return _.replace(string, character, formatString)
    },

    trim(item) {
      return _.trim(item)
    },

    startsWithoutSpace(item) {
      return _.startsWith(item, " ")
    },

    sizeItem(item) {
      return _.size(item)
    },

    truncate(item) {
      return _.truncate(item, {
        'length': 40,
      })
    },
    truncate20(item) {
      return _.truncate(item, {
        'length': 20,
      })
    },
    truncate30(item) {
      return _.truncate(item, {
        'length': 40,
      })
    },
    truncate220(item) {
      return _.truncate(item, {
        'length': 250,
      })
    },
    truncate100(item) {
      return _.truncate(item, {
        'length': 85,
      })
    }
  }
}