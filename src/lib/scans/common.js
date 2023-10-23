import LinesInfo from "./linesInfo";
import { SignalBase } from "./scans";

class SingleLineSignal extends SignalBase {
  gValue = -1;

  /**
   * @param {any[] | undefined} [data]
   */
  getSignal(data) {
    if (!data) return false;
    const bettingLines = data.find(
      (/** @type {{ [x: string]: number; }} */ x) => x["G"] == this.gValue
    );

    return bettingLines?.length == 1;
  }

  getMessage() {
    return `${this.name}: 1 line`;
  }
}

export class TotalSingleLineSignal extends SingleLineSignal {
  constructor() {
    super("Total");
  }

  getSignal() {
    this.gValue = LinesInfo.TOTAL;
    return super.getSignal();
  }
}

export class HandicapSingleLineSignal extends SingleLineSignal {
  constructor() {
    super("Handicap");
  }

  getSignal() {
    this.gValue = LinesInfo.HANDICAP;
    return super.getSignal();
  }
}

class SingleLineOneSideBlockedSignal extends SignalBase {
  gValue = -1;
  blockedSide = "";

  /**
   * @param {any[] | undefined} data
   */
  getSignal(data) {
    if (!data) return false;
    const singleLine = new SingleLineSignal(this.name);
    const bettingLines = data.find(
      (/** @type {{ [x: string]: number; }} */ x) => x["G"] == this.gValue
    );

    if (!singleLine.getSignal()) return false;
    if (!bettingLines.length || !bettingLines["E"]?.length) return false;

    const homeLines = bettingLines["E"][0];
    const awayLines = bettingLines["E"][1];

    const homeBlocked = homeLines?.some(
      (/** @type {{ [x: string]: any; }} */ x) => !!x["B"]
    );
    const awayBlocked = awayLines?.some(
      (/** @type {{ [x: string]: any; }} */ x) => !!x["B"]
    );

    if (homeBlocked != awayBlocked) {
      if (homeBlocked) this.blockedSide = "Home Blocked";
      else this.blockedSide = "Away Blocked";
    }

    return homeBlocked != awayBlocked;
  }

  getMessage() {
    return `${this.name}: 1 line (${this.blockedSide})`;
  }
}

export class TotalSingleLineBlockedOneSideSignal extends SingleLineOneSideBlockedSignal {
  constructor() {
    super("Total");
  }

  /**
   * @param {any[] | undefined} [data]
   */
  getSignal(data) {
    this.gValue = LinesInfo.TOTAL;
    return super.getSignal(data);
  }
}

export class HandicapSingleLineBlockedOneSideSignal extends SingleLineOneSideBlockedSignal {
  constructor() {
    super("Handicap");
  }

  /**
   * @param {any[] | undefined} [data]
   */
  getSignal(data) {
    this.gValue = LinesInfo.HANDICAP;
    return super.getSignal(data);
  }
}
