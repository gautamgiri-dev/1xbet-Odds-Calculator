import { combineUrls, getRequest } from "$lib";

export default class EsportsScanner {
  /**
   * @param {number} matchId
   * @param {string} domain
   */
  constructor(domain, matchId) {
    this.domain = domain;
    this.matchId = matchId;
    this.baseResponse = null;

    this.scans = [];
  }

  async getRegularResponse() {
    const url = combineUrls(
      this.domain,
      `/service-api/LiveFeed/GetGameZip?id=${this.matchId}&lng=en&isSubGames=true&GroupEvents=true&countevents=250&grMode=4&partner=71&topGroups=&marketType=1`
    );

    const baseRequest = await getRequest(url);
    this.baseResponse = baseRequest.Value;
  }
}
