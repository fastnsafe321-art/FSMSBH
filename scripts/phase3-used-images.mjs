/**
 * Homepage-used source photographs for Phase 3.
 * Only paths that appear in mounted homepage UI or its opened galleries.
 */
export const HOMEPAGE_FIRST_PAINT = [
  { file: 'pristine_pitch_night_1781166845895.png', role: 'hero' },
  { file: 'stadium_turf_night_pro_1781167905540.png', role: 'hero' },
  { file: 'natural_sod_clean_blurred_workers_installation_1781170765388.png', role: 'hero' },
  { file: 'highly_visible_hybrid_grass_1781680138763.jpg', role: 'full' },
  { file: 'hybrid_soil_block_clone_1781513567584.jpg', role: 'detail' },
  { file: 'hybrid_backing_detail_1781513147278.jpg', role: 'thumb' },
  { file: 'sub_air_clean_system_1781693372407.jpg', role: 'full' },
  { file: 'sports_engineering_backdrop_1781171108769.png', role: 'backdrop' },
  { file: 'gras2.jpeg', role: 'full' },
  { file: 'gras3.jpeg', role: 'full' },
  { file: 'gras1.jpeg', role: 'full' },
  { file: 'gras4.jpeg', role: 'full' },
  { file: 'artificial_turf_macro_1779106602495.png', role: 'card' },
  { file: 'turf_installation_detail_1779112799699.png', role: 'full' },
  { file: 'artificial_turf_brushing_1779108281366.png', role: 'full' },
  { file: 'elastic_sub_base_1781172457822.png', role: 'full' },
  { file: 'irrigated_sports_pitch_1779108101974.png', role: 'card' },
  { file: 'fence1.jpeg', role: 'card' },
  { file: 'build4.jpeg', role: 'card' },
  { file: 'bahrain_horse_walker_1779781871906.png', role: 'card' },
  { file: 'swim5.jpeg', role: 'card' },
  { file: 'carp6.jpeg', role: 'card' },
  { file: 'hora3.jpeg', role: 'card' },
  { file: 'north2.jpeg', role: 'card' },
  { file: 'isa1.png', role: 'card' },
  { file: 'rashid_equestrian_stables_1779283381737.png', role: 'card' },
  { file: 'turf_installation_workers_1779107984530.png', role: 'card' },
  { file: 'completed_infinity_pool_night_1779108439524.png', role: 'card' },
  { file: 'Maamer 1.png', role: 'card' },
  { file: 'sitra4.png', role: 'card' },
  { file: 'img 11.png', role: 'card' },
  { file: 'ettihad2.png', role: 'card' },
  { file: 'Img 9.png', role: 'card' },
  { file: 'itti2.jpeg', role: 'card' },
  { file: 'budaiya2.png', role: 'card' },
  { file: 'najma6.png', role: 'card' },
  { file: 'al3.jpeg', role: 'card' },
];

export const GALLERY_AND_MODAL = [
  'Final Top View.png',
  'hora1.jpeg', 'hora2.jpeg', 'hora4.jpeg', 'hora5.jpeg', 'hora6.jpeg',
  'hora7.jpeg', 'hora8.jpeg', 'hora9.jpeg', 'hora10.jpeg', 'hora11.jpeg',
  'north1.jpeg', 'north3.jpeg', 'north4.jpeg',
  'isa2.png',
  'rashid_racetrack_grandstand_1779283405835.png',
  'swimming_pool_pumps_room_1779108424776.png',
  'swim4.jpeg', 'swim6.jpeg', 'swim1.jpeg', 'swim2.jpeg', 'swim3.jpeg', 'swim7.jpeg', 'swim8.jpeg',
  'Maamer 2 .png', 'Maamer 3.png', 'Maamer 4.png',
  'sitra1.png', 'sitra6.jpg',
  'mak1.jpeg', 'mak2.jpeg',
  'ettihad1.jpg', 'ettihad3.jpg',
  'is1.jpeg', 'is2.jpeg',
  'ittifaq1.png', 'ittifaq2.png', 'itti1.jpeg',
  'budaiya3.png', 'budaiya4.png',
  'najma5.png', 'najma1.png',
  'al1.jpeg', 'al2.jpeg',
  'artificial_turf_step1_excavation_blurred_1779791458406.png',
  'artificial_turf_step2_base_layer_blurred_1779791479525.png',
  'artificial_turf_step3_compaction_blurred_1779791496550.png',
  'artificial_turf_step4_shock_pad_blurred_1779791511331.png',
  'artificial_turf_step5_turf_laying_blurred_1779791529058.png',
  'artificial_turf_step6_infill_marking_blurred_1779791544054.png',
  'artificial_turf_seam_detail_1779108263687.png',
  'natural_grass_step1_prep_1779792825609.png',
  'natural_grass_step2_grad_1779792841525.png',
  'natural_grass_step3_soil_1779792859511.png',
  'natural_grass_step4_base_1779792877380.png',
  'natural_sod_workers_rolling_1781170444539.png',
  'natural_sod_watering_pro_1781170472132.png',
  'natural_grass_step8_maint_1779792948164.png',
  'drainage_trench_blurred_1779790511693.png',
  'fence2.jpeg', 'fence3.jpeg', 'fence4.png', 'fence5.png',
  'build1.jpeg', 'build2.jpeg', 'build3.jpeg', 'build5.jpeg',
  'horse_walker_paddock_horses_1779108052144.png',
  'horse_walker_rubber_floor_1779108389578.png',
  'horse_walker_control_panel_1779108407100.png',
  'equestrian_paddock_1779107810078.png',
  'carp1.jpeg', 'carp2.jpeg', 'carp3.jpeg', 'carp4.jpeg', 'carp5.jpeg',
  'carpentry_step1_measurement_1779793696843.png',
  'carpentry_step2_design_1779793721487.png',
  'carpentry_step3_materials_1779793737448.png',
].map((file) => ({ file, role: 'gallery' }));

export const ROLE_WIDTHS = {
  hero: [1280, 1920, 2560],
  full: [960, 1600, 1920],
  detail: [800, 1200],
  backdrop: [1280, 1920],
  card: [640, 960],
  thumb: [160, 320],
  gallery: [640, 1280],
};

export const ROLE_QUALITY = {
  hero: 82,
  full: 80,
  detail: 88,
  backdrop: 70,
  card: 80,
  thumb: 82,
  gallery: 80,
};

export function allUsedImages() {
  const map = new Map();
  for (const item of [...HOMEPAGE_FIRST_PAINT, ...GALLERY_AND_MODAL]) {
    if (!map.has(item.file)) map.set(item.file, item);
  }
  return [...map.values()];
}

export function publicPathFor(file) {
  return `/assets/images/${file}`;
}

export function sourceKeyFor(file) {
  return `/src/assets/images/${file}`;
}
