export class SignalBase {
  name;

  /**
   * @param {string} name
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * @returns {boolean} signal
   * @param {any[]} data
   */
  getSignal(data) {
    return false;
  }

  /**
   * @returns {string} message
   */
  getMessage() {
    return "";
  }
}

export class ScanBase {
  sportId;
  signals;

  /**
   * @param {number} sportId
   * @param {SignalBase[]} signals
   */
  constructor(sportId, signals) {
    this.sportId = sportId;
    this.signals = signals;
  }
}
