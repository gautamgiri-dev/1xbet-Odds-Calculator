// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

export type TeamDetails = {
	name: string;
	image: string | number;
}

export type LiveMatches = {
	matchId: number;
	league: string;
	leagueId: number;
	team1: TeamDetails;
	team2: TeamDetails;
	sport: string;
	sportId: number;
}

export type BetData = {
	total: {
		lines: number,
		blocked: string | undefined
	},
	handicap: {
		lines: number,
		blocked: string | undefined
	},
	teamWinsBlocked: string | undefined,
	htRemoved: boolean | undefined
}
