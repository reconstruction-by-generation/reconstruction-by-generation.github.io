/**
 * Quantitative results data for RecGen website charts.
 *
 * Sources:
 *   - Shape/Pose:  recgen/scripts/tables/results/shape_pose_{HB,LMO,WN,AV}.csv
 *   - Perception:  recgen/scripts/tables/results/perception_{LMO,HB,HOPE,Symmetric}.csv
 *   - Ablation:    recgen/scripts/tables/results/ablation_ss_{agg,all}.tex
 *   - Per-object:  RecGen_paper/ECCV2026/tables/per_object_HB_table.tex
 *   - Efficiency:  recgen/scripts/figures/efficiently_table/outputs/benchmark_{recgen,sam3d}.json
 *   - Colors:      recgen/scripts/figures/style.py
 */

// ── Colors (from style.py) ──────────────────────────────────────────
const COLORS = {
  recgen:    '#745CB4',
  recgen2v:  '#9B7FD4',  // RecGen (2-view), lighter variant
  sam3d:     '#3D8DC9',
  baseline1: '#C2DEF0',  // SceneComplete
  baseline2: '#91C4E4',  // Any6D (IM)
  baseline3: '#60AAD8',  // Any6D (Trellis)
  // Ablation variant colors
  ablWoStereo:      '#E07B54',
  ablWoNorm:        '#5BA67E',
  ablObjectsOnly:   '#D4A843',
  ablWoPretraining: '#7B8EC2',
};

const METHODS = ['SceneComplete', 'Any6D (IM)', 'Any6D (Trellis)', 'SAM3D', 'RecGen (1-view)'];
const METHOD_COLORS = [COLORS.baseline1, COLORS.baseline2, COLORS.baseline3, COLORS.sam3d, COLORS.recgen];

// ── Main Results: per-dataset shape & pose (from CSVs, matching paper Table 1) ──
const MAIN_RESULTS = {
  datasets: ['HB', 'ReOcS', 'LMO', 'ArtVIP'],
  methods: METHODS,
  colors: METHOD_COLORS,
  // CD_norm (lower is better)
  CD_norm: {
    HB:     [0.234, 0.074, 0.106, 0.033, 0.032],
    ReOcS:  [null,  0.055, 0.068, 0.026, 0.019],
    LMO:    [0.186, 0.100, 0.116, 0.057, 0.050],
    ArtVIP: [0.189, 0.089, 0.090, 0.056, 0.026],
  },
  // ADD-SB (lower is better)
  ADDSS: {
    HB:     [0.258, 0.111, 0.157, 0.062, 0.049],
    ReOcS:  [null,  0.066, 0.088, 0.057, 0.032],
    LMO:    [0.222, 0.148, 0.196, 0.110, 0.068],
    ArtVIP: [0.201, 0.100, 0.106, 0.073, 0.034],
  },
  // ADD-SB@0.05 (higher is better)
  ADDSS_005: {
    HB:     [35.1, 36.4, 33.8, 54.6, 73.8],
    ReOcS:  [null, 60.8, 47.4, 43.6, 89.5],
    LMO:    [11.3, 11.3, 16.9, 17.6, 50.0],
    ArtVIP: [34.0, 39.1, 37.7, 45.8, 84.0],
  },
  // ADD-SB@0.1 (higher is better)
  ADDSS_010: {
    HB:     [65.2, 68.6, 47.8, 92.4, 95.0],
    ReOcS:  [null, 89.5, 75.5, 96.2, 100.0],
    LMO:    [50.0, 42.2, 29.6, 64.1, 83.1],
    ArtVIP: [57.2, 61.3, 58.0, 79.2, 96.4],
  },
};

// ── Per-object HB: RecGen vs SAM3D (from per_object_HB_table.tex) ──
const PER_OBJECT_HB = {
  objects: [
    'Obj 1','Obj 2','Obj 3','Obj 4','Obj 5','Obj 6','Obj 7','Obj 8','Obj 9','Obj 10',
    'Obj 11','Obj 12','Obj 13','Obj 14','Obj 15','Obj 16','Obj 17','Obj 18','Obj 19','Obj 20',
    'Obj 21','Obj 22','Obj 23','Obj 24','Obj 25','Obj 26','Obj 27','Obj 28','Obj 29','Obj 30',
    'Obj 31','Obj 32','Obj 33',
  ],
  N: [17,9,24,17,14,9,9,16,14,9,9,33,22,18,39,26,29,11,17,9,7,34,27,9,16,11,9,9,17,9,9,12,15],
  sam3d_cd:  [0.024,0.018,0.029,0.026,0.024,0.027,0.015,0.043,0.033,0.020,0.027,0.028,0.037,0.019,0.037,0.026,0.031,0.059,0.027,0.028,0.041,0.027,0.019,0.031,0.024,0.032,0.021,0.015,0.026,0.026,0.023,0.048,0.047],
  recgen_cd: [0.017,0.018,0.036,0.023,0.019,0.021,0.015,0.037,0.022,0.018,0.018,0.035,0.032,0.018,0.052,0.101,0.033,0.016,0.019,0.019,0.029,0.022,0.014,0.019,0.019,0.027,0.021,0.012,0.018,0.021,0.023,0.021,0.038],
  sam3d_addss:  [0.055,0.035,0.048,0.063,0.045,0.069,0.048,0.075,0.047,0.051,0.046,0.052,0.060,0.036,0.059,0.068,0.075,0.089,0.057,0.072,0.120,0.060,0.043,0.050,0.060,0.068,0.039,0.035,0.048,0.052,0.034,0.059,0.098],
  recgen_addss: [0.028,0.027,0.039,0.035,0.028,0.044,0.026,0.044,0.036,0.028,0.028,0.053,0.050,0.026,0.084,0.145,0.072,0.028,0.054,0.026,0.050,0.033,0.027,0.030,0.027,0.040,0.027,0.018,0.029,0.028,0.046,0.027,0.046],
};

// ── Perception: per-dataset (from CSVs) ──
const PERCEPTION = {
  // LMO+HB+HOPE averaged (from paper appearance_results.tex, final table)
  aggregated: {
    label: 'LMO + HB + HOPE',
    methods: ['Any6D (InstantMesh)', 'Any6D (Trellis)', 'SAM3D', 'RecGen (1-view)', 'RecGen (2-view)'],
    LPIPS:     [0.225, 0.263, 0.219, 0.199, 0.199],
    SSIM:      [0.835, 0.829, 0.821, 0.825, 0.824],
    PSNR:      [15.46, 14.56, 15.72, 15.85, 15.82],
    LPIPS_ICP: [0.230, 0.257, 0.161, 0.170, 0.166],
    SSIM_ICP:  [0.825, 0.820, 0.841, 0.834, 0.835],
    PSNR_ICP:  [15.20, 14.48, 17.42, 16.54, 16.62],
  },
  symmetric: {
    label: 'Symmetric Objects',
    methods: ['Any6D (InstantMesh)', 'Any6D (Trellis)', 'SAM3D', 'RecGen (1-view)', 'RecGen (2-view)'],
    LPIPS:     [0.193, 0.190, 0.201, 0.170, 0.172],
    SSIM:      [0.834, 0.834, 0.815, 0.816, 0.817],
    PSNR:      [16.31, 16.45, 16.02, 15.63, 15.59],
    LPIPS_ICP: [0.201, 0.187, 0.156, 0.142, 0.144],
    SSIM_ICP:  [0.822, 0.829, 0.828, 0.827, 0.830],
    PSNR_ICP:  [15.96, 16.50, 17.21, 16.12, 16.08],
  },
};

// ── Ablation: aggregated mean/median (from ablation_ss_agg.tex) ──
const ABLATION_AGG = {
  variants: ['Full model', 'w/o stereo', 'w/o norm', 'w/o parts datasets', 'w/o pretraining'],
  // [mean, median] pairs
  obj_cd:    [[0.042,0.023],[0.048,0.030],[0.042,0.026],[0.040,0.023],[0.044,0.031]],
  obj_addss: [[0.062,0.037],[0.078,0.050],[0.074,0.048],[0.060,0.037],[0.067,0.046]],
  part_cd:   [[0.033,0.020],[0.030,0.018],[0.038,0.025],[0.073,0.037],[0.044,0.028]],
  part_addss:[[0.043,0.028],[0.039,0.027],[0.056,0.041],[0.086,0.048],[0.056,0.036]],
};

// ── Ablation: per-dataset median values (from ablation_ss_barplot.py / ablation_ss_all.tex) ──
const ABLATION_PER_DATASET = {
  datasets: ['HB', 'LM-O', 'ReOcS', 'ArtVIP'],
  variants: ['w/o stereo', 'w/o norm', 'w/o parts datasets', 'w/o pretraining'],
  variantColors: [COLORS.ablWoStereo, COLORS.ablWoNorm, COLORS.ablObjectsOnly, COLORS.ablWoPretraining],
  // Full model baselines (median)
  full: {HB:[0.023,0.038], 'LM-O':[0.037,0.054], ReOcS:[0.019,0.033], ArtVIP:[0.020,0.028]},
  // Variant values (median): {variant: {dataset: [cd, addss]}}
  data: {
    'w/o stereo':      {HB:[0.029,0.052], 'LM-O':[0.049,0.077], ReOcS:[0.024,0.042], ArtVIP:[0.018,0.027]},
    'w/o norm':        {HB:[0.026,0.048], 'LM-O':[0.045,0.077], ReOcS:[0.023,0.042], ArtVIP:[0.025,0.041]},
    'w/o parts datasets': {HB:[0.023,0.036], 'LM-O':[0.035,0.050], ReOcS:[0.018,0.032], ArtVIP:[0.037,0.048]},
    'w/o pretraining': {HB:[0.031,0.047], 'LM-O':[0.046,0.065], ReOcS:[0.023,0.036], ArtVIP:[0.028,0.036]},
  },
};

// ── Efficiency (from benchmark JSONs) ──
const EFFICIENCY = {
  methods: ['RecGen (1-view)', 'RecGen (2-view)', 'SAM3D'],
  time_s:       [7.31, 7.36, 12.97],
  time_std:     [0.20, 0.21, 1.36],
  alloc_gb:     [10.41, 10.39, 17.82],
  alloc_std:    [0.50, 0.46, 0.35],
  smi_gb:       [14.09, 14.03, 21.99],
  smi_std:      [1.63, 1.48, 1.36],
  gpu: 'NVIDIA A100-SXM4-80GB',
};

// ── Shape & Pose: per-dataset full table (from CSVs, matching paper Table 1) ──
const SHAPE_POSE_PER_DATASET = {
  methods: ['SceneComplete', 'Any6D (InstantMesh)', 'Any6D (Trellis)', 'SAM3D', 'RecGen (1-view)', 'RecGen (2-view)'],
  datasets: {
    HB: {
      N: 538,
      CD_norm:  [0.234, 0.074, 0.106, 0.033, 0.032, 0.029],
      ADDSS:    [0.258, 0.111, 0.157, 0.062, 0.049, 0.048],
      ADDSS_10: [65.2,  68.6,  47.8,  92.4,  95.0,  95.4],
      ADDSS_05: [35.1,  36.4,  33.8,  54.6,  73.8,  74.2],
      DRE_05:   [0.0,   33.6,  26.8,  34.6,  51.5,  50.9],
    },
    ReOcS: {
      N: 314,
      CD_norm:  [0.765, 0.055, 0.068, 0.026, 0.019, 0.018],
      ADDSS:    [0.774, 0.066, 0.088, 0.057, 0.032, 0.032],
      ADDSS_10: [38.2,  89.5,  75.5,  96.2,  100.0, 99.7],
      ADDSS_05: [26.1,  60.8,  47.4,  43.6,  89.5,  91.1],
      DRE_05:   [0.0,   60.5,  47.1,  25.8,  60.8,  62.4],
    },
    LMO: {
      N: 142,
      CD_norm:  [0.186, 0.100, 0.116, 0.057, 0.050, 0.056],
      ADDSS:    [0.222, 0.148, 0.196, 0.110, 0.068, 0.075],
      ADDSS_10: [50.0,  42.2,  29.6,  64.1,  83.1,  83.1],
      ADDSS_05: [11.3,  11.3,  16.9,  17.6,  50.0,  55.6],
      DRE_05:   [0.0,   19.0,  15.5,  34.5,  38.0,  37.3],
    },
    ArtVIP: {
      N: 500,
      CD_norm:  [0.189, 0.089, 0.090, 0.056, 0.026, 0.024],
      ADDSS:    [0.201, 0.100, 0.106, 0.073, 0.034, 0.032],
      ADDSS_10: [57.2,  61.3,  58.0,  79.2,  96.4,  96.4],
      ADDSS_05: [34.0,  39.1,  37.7,  45.8,  84.0,  86.4],
      DRE_05:   [0.6,   16.2,  16.8,  22.6,  24.4,  24.8],
    },
  },
};

// ── Pre-computed averages for Section 1 charts ──
const METHODS_6 = SHAPE_POSE_PER_DATASET.methods;
const METHOD_COLORS_6 = [COLORS.baseline1, COLORS.baseline2, COLORS.baseline3, COLORS.sam3d, COLORS.recgen, COLORS.recgen2v];

const SHAPE_POSE_AVERAGES = {
  methods: METHODS_6,
  colors: METHOD_COLORS_6,
  groups: ['Object-centric', 'Part-centric'],
  // Object-centric = mean(HB, ReOcS, LMO); Part-centric = ArtVIP
  CD_norm: {
    'Object-centric': [0.395, 0.076, 0.097, 0.039, 0.034, 0.034],
    'Part-centric':   [0.189, 0.089, 0.090, 0.056, 0.026, 0.024],
  },
  ADDSS: {
    'Object-centric': [0.418, 0.108, 0.147, 0.076, 0.050, 0.052],
    'Part-centric':   [0.201, 0.100, 0.106, 0.073, 0.034, 0.032],
  },
  ADDSS_05: {
    'Object-centric': [24.2, 36.2, 32.7, 38.6, 71.1, 73.6],
    'Part-centric':   [34.0, 39.1, 37.7, 45.8, 84.0, 86.4],
  },
};

// ── Occlusion analysis: object-centric pooled mean across HB+LMO+ReOcS (matches paper appendix) ──
const OCCLUSION_ANALYSIS = {
  bins: ['0-3%', '3-20%', '20-40%', '40-70%'],
  counts: [518, 276, 116, 78],
  methods: ['SAM3D', 'RecGen'],
  colors: [COLORS.sam3d, COLORS.recgen],
  CD_norm: {
    SAM3D:  [0.0264, 0.0316, 0.0556, 0.0613],
    RecGen: [0.0279, 0.0255, 0.0352, 0.0542],
  },
  ADDSS: {
    SAM3D:  [0.0527, 0.0651, 0.0980, 0.1160],
    RecGen: [0.0440, 0.0398, 0.0486, 0.0729],
  },
};

// ── VLM Alignment: symmetric objects (from vlm_orientation_barplot.py) ──
const VLM_ALIGNMENT = {
  labels: ['Obj 3', 'Obj 8', 'Obj 12', 'Obj 25', 'Obj 29', 'Average'],
  sam3d:  [32.0, 50.0, 34.5, 52.4, 41.2, 41.0],
  recgen: [88.0, 71.4, 72.4, 76.2, 58.8, 74.0],
  colors: { sam3d: COLORS.sam3d, recgen: COLORS.recgen },
};

// ── Multi-view pose selection (from multiview_pose_selection table) ──
const MULTIVIEW = {
  datasets: ['HB', 'LMO', 'ReOcS', 'ArtVIP', 'Average'],
  methods: ['1-view', '2-view'],
  colors: [COLORS.recgen, COLORS.recgen2v],
  CD_norm: {
    '1-view': [0.032, 0.051, 0.019, 0.026, 0.032],
    // '2-view (no selection)': [0.029, 0.056, 0.018, 0.024, 0.032],
    '2-view': [0.026, 0.043, 0.019, 0.023, 0.028],
  },
  ADDSS: {
    '1-view': [0.049, 0.068, 0.032, 0.034, 0.046],
    // '2-view (no selection)': [0.048, 0.075, 0.032, 0.032, 0.047],
    '2-view': [0.043, 0.059, 0.033, 0.030, 0.041],
  },
};

// ── Ablation: grouped average (Object-centric = avg HB/LM-O/ReOcS, Part-centric = ArtVIP) ──
const ABLATION_AVG = {
  groups: ['Object-centric', 'Part-centric'],
  variants: ['w/o stereo', 'w/o norm', 'w/o parts datasets', 'w/o pretraining'],
  variantColors: [COLORS.ablWoStereo, COLORS.ablWoNorm, COLORS.ablObjectsOnly, COLORS.ablWoPretraining],
  // full model baselines [cd, addss] per group
  full: {
    'Object-centric': [0.0263, 0.0417],  // avg of HB/LM-O/ReOcS
    'Part-centric':   [0.020,  0.028],   // ArtVIP
  },
  // variant values [cd, addss] per group
  data: {
    'w/o stereo':         { 'Object-centric': [0.0340, 0.0570], 'Part-centric': [0.018, 0.027] },
    'w/o norm':           { 'Object-centric': [0.0313, 0.0557], 'Part-centric': [0.025, 0.041] },
    'w/o parts datasets': { 'Object-centric': [0.0253, 0.0393], 'Part-centric': [0.037, 0.048] },
    'w/o pretraining':    { 'Object-centric': [0.0333, 0.0493], 'Part-centric': [0.028, 0.036] },
  },
};
