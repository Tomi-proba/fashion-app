import type { Player, Position } from '../types';

// Reálisnak ható, de nem élő szezon-átlagok — a draft-játékhoz, nem statisztikai
// referenciának. [név, csapat, poszt, PTS, REB, AST, STL, BLK, 3PM, TOV]
type Row = [string, string, Position, number, number, number, number, number, number, number];

const ROWS: Row[] = [
  ['Nikola Jokić', 'DEN', 'C', 29.0, 12.5, 10.5, 1.3, 0.9, 1.1, 3.2],
  ['Luka Dončić', 'LAL', 'PG', 32.0, 8.5, 8.5, 1.4, 0.5, 3.8, 3.8],
  ['Shai Gilgeous-Alexander', 'OKC', 'PG', 31.5, 5.5, 6.2, 1.8, 0.9, 1.8, 2.3],
  ['Giannis Antetokounmpo', 'MIL', 'PF', 30.5, 11.5, 6.0, 1.1, 1.1, 0.5, 3.3],
  ['Jayson Tatum', 'BOS', 'SF', 27.5, 8.5, 5.0, 1.0, 0.6, 3.1, 2.6],
  ['Anthony Davis', 'LAL', 'PF', 25.0, 11.5, 3.5, 1.1, 2.1, 0.7, 2.1],
  ['Joel Embiid', 'PHI', 'C', 28.0, 10.5, 4.0, 0.9, 1.5, 1.1, 3.2],
  ['Kevin Durant', 'PHX', 'SF', 27.0, 6.5, 4.5, 0.7, 1.2, 2.2, 3.0],
  ['Stephen Curry', 'GSW', 'PG', 26.5, 4.5, 6.0, 0.9, 0.4, 4.8, 2.9],
  ['Damian Lillard', 'MIL', 'PG', 24.5, 4.3, 6.8, 0.9, 0.3, 3.5, 2.6],
  ['Devin Booker', 'PHX', 'SG', 26.0, 4.5, 6.8, 1.0, 0.3, 2.4, 3.0],
  ['LeBron James', 'LAL', 'SF', 24.5, 7.5, 8.0, 1.1, 0.5, 2.0, 3.4],
  ['Anthony Edwards', 'MIN', 'SG', 27.5, 5.5, 4.5, 1.2, 0.5, 3.1, 3.0],
  ['Tyrese Haliburton', 'IND', 'PG', 18.5, 3.8, 9.5, 1.2, 0.6, 2.5, 2.4],
  ['Domantas Sabonis', 'SAC', 'C', 19.5, 13.5, 7.0, 0.9, 0.5, 0.5, 2.9],
  ['Karl-Anthony Towns', 'NYK', 'C', 22.5, 12.5, 3.0, 0.7, 1.0, 2.1, 2.7],
  ['Jimmy Butler', 'GSW', 'SF', 20.5, 5.5, 4.8, 1.4, 0.3, 1.0, 1.5],
  ['Kawhi Leonard', 'LAC', 'SF', 23.5, 6.0, 3.5, 1.5, 0.5, 1.8, 1.7],
  ['Paul George', 'PHI', 'SF', 20.0, 5.5, 3.5, 1.4, 0.4, 2.5, 2.0],
  ['Trae Young', 'ATL', 'PG', 24.5, 3.0, 10.5, 1.1, 0.1, 2.9, 4.2],
  ['Ja Morant', 'MEM', 'PG', 25.0, 5.5, 7.0, 0.9, 0.3, 1.5, 3.1],
  ['Zion Williamson', 'NOP', 'PF', 22.5, 6.5, 5.0, 1.1, 0.6, 0.2, 3.0],
  ['Donovan Mitchell', 'CLE', 'SG', 27.0, 5.0, 5.5, 1.4, 0.4, 3.1, 2.8],
  ["De'Aaron Fox", 'SAS', 'PG', 24.0, 4.5, 6.0, 1.5, 0.4, 2.0, 2.9],
  ['Bam Adebayo', 'MIA', 'C', 19.5, 10.0, 4.0, 1.1, 0.8, 0.2, 2.4],
  ['Rudy Gobert', 'MIN', 'C', 12.5, 12.5, 1.5, 0.6, 2.0, 0.0, 1.5],
  ['Victor Wembanyama', 'SAS', 'C', 24.5, 11.0, 3.9, 1.2, 3.8, 1.8, 2.9],
  ['Chet Holmgren', 'OKC', 'PF', 17.0, 8.0, 2.5, 0.8, 2.3, 1.6, 1.7],
  ['Paolo Banchero', 'ORL', 'PF', 25.5, 7.5, 5.0, 0.9, 0.6, 1.5, 3.0],
  ['Franz Wagner', 'ORL', 'SF', 23.0, 5.5, 4.0, 1.0, 0.4, 1.5, 2.1],
  ['Scottie Barnes', 'TOR', 'SF', 20.0, 8.0, 6.0, 1.2, 0.9, 1.3, 2.5],
  ['Cade Cunningham', 'DET', 'PG', 24.5, 6.5, 9.0, 1.0, 0.6, 2.0, 3.9],
  ['LaMelo Ball', 'CHA', 'PG', 25.5, 5.5, 7.5, 1.3, 0.3, 3.6, 3.3],
  ['Jalen Brunson', 'NYK', 'PG', 26.0, 3.5, 7.0, 0.9, 0.2, 2.3, 2.4],
  ['Jamal Murray', 'DEN', 'PG', 21.5, 4.0, 6.0, 1.0, 0.3, 2.2, 2.5],
  ['Kyrie Irving', 'DAL', 'PG', 24.5, 4.5, 5.0, 1.2, 0.4, 2.6, 2.1],
  ['Brandon Ingram', 'TOR', 'SF', 20.5, 5.0, 5.5, 0.7, 0.5, 1.7, 2.6],
  ['Zach LaVine', 'SAC', 'SG', 21.5, 4.5, 4.0, 0.7, 0.3, 2.6, 2.4],
  ['Pascal Siakam', 'IND', 'PF', 21.0, 7.0, 3.5, 0.8, 0.5, 1.5, 2.2],
  ['Julius Randle', 'MIN', 'PF', 20.5, 8.5, 4.5, 0.7, 0.3, 1.5, 2.9],
  ['Klay Thompson', 'DAL', 'SG', 15.5, 3.5, 2.0, 0.6, 0.4, 2.8, 1.2],
  ['Draymond Green', 'GSW', 'PF', 8.5, 6.5, 5.5, 1.0, 0.9, 1.0, 2.0],
  ['Fred VanVleet', 'HOU', 'PG', 17.5, 3.8, 5.5, 1.1, 0.5, 2.7, 1.9],
  ['CJ McCollum', 'NOP', 'SG', 21.0, 4.0, 4.0, 0.9, 0.3, 2.9, 2.2],
  ['DeMar DeRozan', 'SAC', 'SF', 22.0, 4.5, 5.0, 1.0, 0.3, 0.5, 1.9],
  ['Jaylen Brown', 'BOS', 'SG', 23.0, 5.5, 3.5, 1.1, 0.5, 2.2, 2.5],
  ['Mikal Bridges', 'NYK', 'SF', 18.0, 4.5, 3.5, 1.0, 0.4, 2.3, 1.7],
  ['OG Anunoby', 'NYK', 'SF', 16.5, 5.0, 2.0, 1.3, 0.6, 2.0, 1.2],
  ['Alperen Şengün', 'HOU', 'C', 19.5, 10.5, 5.0, 1.1, 0.8, 0.3, 2.7],
  ['Lauri Markkanen', 'UTA', 'PF', 20.5, 6.0, 2.0, 0.7, 0.4, 2.5, 1.7],
  ['Deandre Ayton', 'LAL', 'C', 15.5, 10.5, 2.0, 0.6, 0.9, 0.0, 1.8],
  ['Myles Turner', 'MIL', 'C', 16.5, 6.5, 1.5, 0.7, 1.8, 2.2, 1.3],
  ['Jarrett Allen', 'CLE', 'C', 14.0, 9.5, 2.5, 0.9, 1.1, 0.0, 1.5],
  ['Nikola Vučević', 'CHI', 'C', 18.0, 10.5, 3.5, 0.7, 0.7, 1.8, 1.9],
];

export const PLAYERS: Player[] = ROWS.map(([name, team, position, pts, reb, ast, stl, blk, tpm, tov]) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  team,
  position,
  stats: { pts, reb, ast, stl, blk, tpm, tov },
}));

export function getPlayer(id: string): Player | undefined {
  return PLAYERS.find((p) => p.id === id);
}
