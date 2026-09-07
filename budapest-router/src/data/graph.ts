import type { GraphEdge, GraphNode } from '../types';

// Egy sematikus, kézzel épített Budapest-hálózat valós, felismerhető
// helyszínekkel — NEM GPS-pontos térkép és nem élő forgalmi adat. A koordináták
// a valós elrendezést közelítik (Duna, Buda nyugaton, Pest keleten), hogy a
// térkép ismerős legyen, de az útvonalak illusztrációk, nem navigációs adatok.
export const NODES: GraphNode[] = [
  // Buda
  { id: 'obuda', name: 'Óbuda (Bécsi út)', side: 'buda', x: 330, y: 90 },
  { id: 'margit_hid_buda', name: 'Margit híd (budai hídfő)', side: 'buda', x: 390, y: 170 },
  { id: 'szell_kalman', name: 'Széll Kálmán tér', side: 'buda', x: 270, y: 220 },
  { id: 'batthyany', name: 'Batthyány tér', side: 'buda', x: 370, y: 230 },
  { id: 'varnegyed', name: 'Budai Várnegyed', side: 'buda', x: 330, y: 280 },
  { id: 'deli', name: 'Déli pályaudvar', side: 'buda', x: 240, y: 290 },
  { id: 'gellert', name: 'Gellért tér', side: 'buda', x: 350, y: 380 },
  { id: 'moricz', name: 'Móricz Zsigmond körtér', side: 'buda', x: 270, y: 400 },
  { id: 'kelenfold', name: 'Kelenföld vasútállomás', side: 'buda', x: 200, y: 470 },

  // Pest
  { id: 'nyugati', name: 'Nyugati pályaudvar', side: 'pest', x: 480, y: 160 },
  { id: 'kossuth', name: 'Kossuth Lajos tér', side: 'pest', x: 430, y: 200 },
  { id: 'arany_janos', name: 'Arany János utca', side: 'pest', x: 470, y: 230 },
  { id: 'oktogon', name: 'Oktogon', side: 'pest', x: 520, y: 210 },
  { id: 'deak', name: 'Deák Ferenc tér', side: 'pest', x: 500, y: 260 },
  { id: 'astoria', name: 'Astoria', side: 'pest', x: 540, y: 290 },
  { id: 'ferenciek', name: 'Ferenciek tere', side: 'pest', x: 460, y: 310 },
  { id: 'blaha', name: 'Blaha Lujza tér', side: 'pest', x: 570, y: 260 },
  { id: 'kalvin', name: 'Kálvin tér', side: 'pest', x: 510, y: 340 },
  { id: 'rakoczi_ter', name: 'Rákóczi tér', side: 'pest', x: 550, y: 360 },
  { id: 'corvin', name: 'Corvin-negyed', side: 'pest', x: 590, y: 350 },
  { id: 'boraros', name: 'Boráros tér', side: 'pest', x: 460, y: 410 },
  { id: 'nepliget', name: 'Népliget', side: 'pest', x: 620, y: 420 },
  { id: 'keleti', name: 'Keleti pályaudvar', side: 'pest', x: 610, y: 210 },
  { id: 'puskas', name: 'Puskás Ferenc Stadion', side: 'pest', x: 650, y: 250 },
  { id: 'bosnyak', name: 'Bosnyák tér', side: 'pest', x: 600, y: 130 },
  { id: 'ors_vezer', name: 'Örs vezér tere', side: 'pest', x: 690, y: 190 },
  { id: 'csepel', name: 'Csepel (Határ út)', side: 'pest', x: 520, y: 540 },
];

export const EDGES: GraphEdge[] = [
  // Buda belső
  { from: 'obuda', to: 'margit_hid_buda', mode: 'car', distanceKm: 2.8 },
  { from: 'obuda', to: 'szell_kalman', mode: 'transit', distanceKm: 3.5 },
  { from: 'margit_hid_buda', to: 'batthyany', mode: 'walk', distanceKm: 1.0 },
  { from: 'margit_hid_buda', to: 'szell_kalman', mode: 'transit', distanceKm: 1.8 },
  { from: 'szell_kalman', to: 'batthyany', mode: 'walk', distanceKm: 1.2 },
  { from: 'szell_kalman', to: 'varnegyed', mode: 'walk', distanceKm: 1.3 },
  { from: 'szell_kalman', to: 'deli', mode: 'transit', distanceKm: 1.5 },
  { from: 'batthyany', to: 'varnegyed', mode: 'walk', distanceKm: 0.9 },
  { from: 'varnegyed', to: 'gellert', mode: 'walk', distanceKm: 1.6 },
  { from: 'deli', to: 'moricz', mode: 'transit', distanceKm: 2.0 },
  { from: 'deli', to: 'kelenfold', mode: 'car', distanceKm: 3.0 },
  { from: 'moricz', to: 'gellert', mode: 'transit', distanceKm: 1.4 },
  { from: 'moricz', to: 'kelenfold', mode: 'transit', distanceKm: 2.5 },
  { from: 'moricz', to: 'deli', mode: 'walk', distanceKm: 2.2 },

  // Hidak (Buda <-> Pest)
  { from: 'margit_hid_buda', to: 'kossuth', mode: 'car', distanceKm: 1.5 },
  { from: 'varnegyed', to: 'arany_janos', mode: 'walk', distanceKm: 1.1 },
  { from: 'varnegyed', to: 'arany_janos', mode: 'transit', distanceKm: 1.1 },
  { from: 'gellert', to: 'ferenciek', mode: 'car', distanceKm: 1.8 },
  { from: 'gellert', to: 'ferenciek', mode: 'transit', distanceKm: 1.8 },
  { from: 'gellert', to: 'kalvin', mode: 'car', distanceKm: 2.0 },
  { from: 'moricz', to: 'boraros', mode: 'car', distanceKm: 2.2 },
  { from: 'moricz', to: 'boraros', mode: 'transit', distanceKm: 2.2 },

  // Pest belső
  { from: 'nyugati', to: 'oktogon', mode: 'transit', distanceKm: 2.0 },
  { from: 'nyugati', to: 'kossuth', mode: 'walk', distanceKm: 2.3 },
  { from: 'nyugati', to: 'arany_janos', mode: 'transit', distanceKm: 1.8 },
  { from: 'kossuth', to: 'arany_janos', mode: 'walk', distanceKm: 1.0 },
  { from: 'kossuth', to: 'deak', mode: 'transit', distanceKm: 1.6 },
  { from: 'oktogon', to: 'deak', mode: 'transit', distanceKm: 1.5 },
  { from: 'oktogon', to: 'blaha', mode: 'walk', distanceKm: 1.7 },
  { from: 'deak', to: 'astoria', mode: 'walk', distanceKm: 0.9 },
  { from: 'deak', to: 'arany_janos', mode: 'walk', distanceKm: 0.8 },
  { from: 'astoria', to: 'blaha', mode: 'walk', distanceKm: 1.0 },
  { from: 'astoria', to: 'kalvin', mode: 'walk', distanceKm: 1.1 },
  { from: 'astoria', to: 'ferenciek', mode: 'walk', distanceKm: 1.0 },
  { from: 'kalvin', to: 'ferenciek', mode: 'walk', distanceKm: 1.0 },
  { from: 'kalvin', to: 'rakoczi_ter', mode: 'walk', distanceKm: 1.2 },
  { from: 'kalvin', to: 'corvin', mode: 'transit', distanceKm: 1.3 },
  { from: 'kalvin', to: 'boraros', mode: 'walk', distanceKm: 1.4 },
  { from: 'blaha', to: 'keleti', mode: 'transit', distanceKm: 1.8 },
  { from: 'blaha', to: 'rakoczi_ter', mode: 'walk', distanceKm: 1.3 },
  { from: 'keleti', to: 'puskas', mode: 'transit', distanceKm: 2.0 },
  { from: 'keleti', to: 'bosnyak', mode: 'car', distanceKm: 3.2 },
  { from: 'puskas', to: 'ors_vezer', mode: 'transit', distanceKm: 1.6 },
  { from: 'bosnyak', to: 'ors_vezer', mode: 'transit', distanceKm: 2.8 },
  { from: 'corvin', to: 'rakoczi_ter', mode: 'walk', distanceKm: 0.9 },
  { from: 'corvin', to: 'nepliget', mode: 'transit', distanceKm: 2.4 },
  { from: 'rakoczi_ter', to: 'nepliget', mode: 'car', distanceKm: 2.6 },
  { from: 'nepliget', to: 'csepel', mode: 'car', distanceKm: 4.5 },
  { from: 'boraros', to: 'csepel', mode: 'transit', distanceKm: 5.0 },
  { from: 'ferenciek', to: 'kossuth', mode: 'walk', distanceKm: 1.6 },
];

export function getNode(id: string): GraphNode | undefined {
  return NODES.find((n) => n.id === id);
}
