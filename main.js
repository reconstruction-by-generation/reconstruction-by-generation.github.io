// ===== Theme Toggle =====
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('recgen-theme', next);
  });
});

// ===== Method Slideshow =====
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.method-slide');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  const playPauseBtn = document.getElementById('slidePlayPause');
  const slideNum = document.getElementById('slideNum');

  if (slides.length === 0) return;

  let current = 0;
  let isPlaying = true;
  let intervalId = null;
  const intervalTime = 8000;

  const iconPause = playPauseBtn?.querySelector('.icon-pause');
  const iconPlay = playPauseBtn?.querySelector('.icon-play');

  function goToSlide(index) {
    slides[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (slideNum) slideNum.textContent = current + 1;
  }

  function startAutoPlay() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => goToSlide(current + 1), intervalTime);
  }

  function updatePlayPauseIcon() {
    if (iconPause && iconPlay) {
      iconPause.style.display = isPlaying ? 'block' : 'none';
      iconPlay.style.display = isPlaying ? 'none' : 'block';
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    goToSlide(current - 1);
    if (isPlaying) startAutoPlay();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    goToSlide(current + 1);
    if (isPlaying) startAutoPlay();
  });

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        startAutoPlay();
      } else {
        clearInterval(intervalId);
      }
      updatePlayPauseIcon();
    });
  }

  startAutoPlay();
});

// ===== BibTeX Copy Button =====
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('bibtexCopyBtn');
  if (!btn) return;
  const code = btn.closest('.bibtex-code')?.querySelector('code');
  if (!code) return;

  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(code.textContent.trim()).then(() => {
      btn.classList.add('copied');
      btn.querySelector('span').textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.querySelector('span').textContent = 'Copy';
      }, 2000);
    });
  });
});

// ===== Horizontal Navigation Bar =====
document.addEventListener('DOMContentLoaded', () => {
  const horizontalNav = document.getElementById('horizontalNav');
  const navItems = document.querySelectorAll('.horizontal-nav-item');
  const heroFlow = document.querySelector('.hero-flow');

  // Build section list from nav items
  const navSections = [];
  navItems.forEach(item => {
    const id = item.dataset.section;
    const el = id === 'hero' ? heroFlow : document.getElementById(id);
    if (el) navSections.push({ id, el });
  });

  // Show nav after scrolling past the hero
  const updateNavVisibility = () => {
    if (!horizontalNav || !heroFlow) return;
    const heroBottom = heroFlow.getBoundingClientRect().bottom;
    horizontalNav.classList.toggle('visible', heroBottom < 0);
  };

  // Highlight active section
  const updateActiveNav = () => {
    if (navSections.length === 0) return;
    const threshold = window.innerHeight * 0.35;
    let activeIdx = 0;
    for (let idx = 0; idx < navSections.length; idx++) {
      if (navSections[idx].el.getBoundingClientRect().top <= threshold) {
        activeIdx = idx;
      } else {
        break;
      }
    }
    navItems.forEach(item => {
      const idx = navSections.findIndex(s => s.id === item.dataset.section);
      item.classList.toggle('active', idx === activeIdx);
    });
  };

  window.addEventListener('scroll', () => {
    updateNavVisibility();
    updateActiveNav();
  }, { passive: true });
  updateNavVisibility();
  updateActiveNav();

  // Smooth scroll on click
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const id = item.dataset.section;
      const target = id === 'hero' ? heroFlow : document.getElementById(id);
      if (target) {
        const offset = horizontalNav.offsetHeight + 8;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
});

// ===== Progress Sidebar =====
document.addEventListener('DOMContentLoaded', () => {
  const progressItems = document.querySelectorAll('.progress-item');
  const progressLineFill = document.querySelector('.progress-line-fill');
  const progressTrack = document.querySelector('.progress-track');

  const sections = [];
  progressItems.forEach(item => {
    const id = item.dataset.section;
    let el;
    if (id === 'hero') {
      el = document.querySelector('.hero-flow');
    } else {
      el = document.getElementById(id);
    }
    if (el) sections.push({ id, el });
  });

  const updateProgress = () => {
    if (sections.length === 0) return;
    const activationThreshold = window.innerHeight * 0.35;
    let activeIdx = 0;
    for (let idx = 0; idx < sections.length; idx++) {
      if (sections[idx].el.getBoundingClientRect().top <= activationThreshold) {
        activeIdx = idx;
      } else {
        break;
      }
    }
    if (progressLineFill && progressTrack) {
      const maxFillHeight = progressTrack.offsetHeight - 44;
      const fillHeight = (activeIdx / Math.max(sections.length - 1, 1)) * maxFillHeight;
      progressLineFill.style.height = `${Math.min(Math.max(fillHeight, 0), maxFillHeight)}px`;
    }
    progressItems.forEach(item => {
      const sectionIdx = sections.findIndex(s => s.id === item.dataset.section);
      item.classList.remove('active', 'passed');
      if (sectionIdx === activeIdx) item.classList.add('active');
      else if (sectionIdx >= 0 && sectionIdx < activeIdx) item.classList.add('passed');
    });
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
});

// ===== Mobile detection =====
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) ||
    ('ontouchstart' in window && navigator.maxTouchPoints > 2);
}

// ===== Scene Data & Input Image Overlay Animation =====
document.addEventListener('DOMContentLoaded', () => {
  const inputImg = document.getElementById('gsplatInputImg');
  const overlayImg = document.getElementById('gsplatOverlayImg');
  const activeName = document.getElementById('gsplatActiveName');

  const scenes = {
    HB_000003: { label: 'HB Scene 3', img: './assets/meshes/HB_000003/input.jpg', overlay: './assets/meshes/HB_000003/input_overlay.jpg', center: [0.029, -0.120, 0.968], radius: 0.25 },
    HB_000005: { label: 'HB Scene 5', img: './assets/meshes/HB_000005/input.jpg', overlay: './assets/meshes/HB_000005/input_overlay.jpg', center: [-0.058, -0.035, 0.884], radius: 0.28 },
    HB_000006: { label: 'HB Scene 6', img: './assets/meshes/HB_000006/input.jpg', overlay: './assets/meshes/HB_000006/input_overlay.jpg', center: [-0.041, -0.070, 0.869], radius: 0.26 },
    HB_000007: { label: 'HB Scene 7', img: './assets/meshes/HB_000007/input.jpg', overlay: './assets/meshes/HB_000007/input_overlay.jpg', center: [-0.019, -0.105, 0.907], radius: 0.25 },
    HB_000008: { label: 'HB Scene 8', img: './assets/meshes/HB_000008/input.jpg', overlay: './assets/meshes/HB_000008/input_overlay.jpg', center: [0.009, -0.090, 0.893], radius: 0.27 },
    WN_000000: { label: 'ReOcS Scene 0', img: './assets/meshes/WN_000000/input.jpg', overlay: './assets/meshes/WN_000000/input_overlay.jpg', center: [-0.233, 0.019, 0.799], radius: 0.34 },
    WN_000001: { label: 'ReOcS Scene 1', img: './assets/meshes/WN_000001/input.jpg', overlay: './assets/meshes/WN_000001/input_overlay.jpg', center: [-0.313, -0.069, 0.939], radius: 0.34 },
    WN_000006: { label: 'ReOcS Scene 6', img: './assets/meshes/WN_000006/input.jpg', overlay: './assets/meshes/WN_000006/input_overlay.jpg', center: [-0.090, 0.115, 0.730], radius: 0.35 },
    HOPE_000002: { label: 'HOPE Scene 2', img: './assets/meshes/HOPE_000002/input.jpg', overlay: './assets/meshes/HOPE_000002/input_overlay.jpg', center: [-0.025, 0.113, 0.857], radius: 0.38 },
    HOPE_000007: { label: 'HOPE Scene 7', img: './assets/meshes/HOPE_000007/input.jpg', overlay: './assets/meshes/HOPE_000007/input_overlay.jpg', center: [-0.064, 0.018, 0.699], radius: 0.35 },
    HOPE_000003: { label: 'HOPE Scene 3', img: './assets/meshes/HOPE_000003/input.jpg', overlay: './assets/meshes/HOPE_000003/input_overlay.jpg', center: [0.099, 0.118, 0.707], radius: 0.42 },
    LMO_000002: { label: 'LM-O Scene 2', img: './assets/meshes/LMO_000002/input.jpg', overlay: './assets/meshes/LMO_000002/input_overlay.jpg', center: [0.095, -0.023, 1.052], radius: 0.37 },
    AV_041703: { label: 'ArtVIP 041703', img: './assets/meshes/AV_041703/input.jpg', overlay: './assets/meshes/AV_041703/input_overlay.jpg', center: [-0.091, 0.060, 1.039], radius: 0.22 },
    AV_071101: { label: 'ArtVIP 071101', img: './assets/meshes/AV_071101/input.jpg', overlay: './assets/meshes/AV_071101/input_overlay.jpg', center: [0.059, -0.081, 1.685], radius: 0.58 },
    AV_010001: { label: 'ArtVIP 010001', img: './assets/meshes/AV_010001/input.jpg', overlay: './assets/meshes/AV_010001/input_overlay.jpg', center: [-0.005, -0.031, 1.642], radius: 0.28 },
    AV_090202: { label: 'ArtVIP 090202', img: './assets/meshes/AV_090202/input.jpg', overlay: './assets/meshes/AV_090202/input_overlay.jpg', center: [0.026, -0.003, 1.711], radius: 0.89 },
    AV_010602: { label: 'ArtVIP 010602', img: './assets/meshes/AV_010602/input.jpg', overlay: './assets/meshes/AV_010602/input_overlay.jpg', center: [0.031, -0.055, 1.743], radius: 0.19 },
    AV_020001: { label: 'ArtVIP 020001', img: './assets/meshes/AV_020001/input.jpg', overlay: './assets/meshes/AV_020001/input_overlay.jpg', center: [-0.020, 0.024, 1.666], radius: 0.27 },
    AV_030102: { label: 'ArtVIP 030102', img: './assets/meshes/AV_030102/input.jpg', overlay: './assets/meshes/AV_030102/input_overlay.jpg', center: [-0.734, 0.275, 2.834], radius: 0.31 },
    AV_070907: { label: 'ArtVIP 070907', img: './assets/meshes/AV_070907/input.jpg', overlay: './assets/meshes/AV_070907/input_overlay.jpg', center: [-0.116, -0.147, 1.338], radius: 0.92 },
    AV_071102: { label: 'ArtVIP 071102', img: './assets/meshes/AV_071102/input.jpg', overlay: './assets/meshes/AV_071102/input_overlay.jpg', center: [-0.004, -0.253, 1.257], radius: 0.41 },
    AV_110303: { label: 'ArtVIP 110303', img: './assets/meshes/AV_110303/input.jpg', overlay: './assets/meshes/AV_110303/input_overlay.jpg', center: [-0.063, 0.004, 1.640], radius: 0.26 },

    AV_030701: { label: 'ArtVIP 030701', img: './assets/meshes/AV_030701/input.jpg', overlay: './assets/meshes/AV_030701/input_overlay.jpg', center: [0.017, -0.051, 1.625], radius: 0.61 },

    AV_011003: { label: 'ArtVIP 011003', img: './assets/meshes/AV_011003/input.jpg', overlay: './assets/meshes/AV_011003/input_overlay.jpg', center: [0.004, -0.079, 1.587], radius: 0.13 },
    DROID_000: { label: 'DROID Scene 1', img: './assets/meshes/DROID_000/input.jpg', overlay: './assets/meshes/DROID_000/input_overlay.jpg', center: [0.176, 0.138, 1.295], radius: 0.47 },
    DROID_001: { label: 'DROID Scene 2', img: './assets/meshes/DROID_001/input.jpg', overlay: './assets/meshes/DROID_001/input_overlay.jpg', center: [-0.001, -0.090, 1.472], radius: 0.53 },
    DROID_002: { label: 'DROID Scene 3', img: './assets/meshes/DROID_002/input.jpg', overlay: './assets/meshes/DROID_002/input_overlay.jpg', center: [-0.197, 0.063, 1.448], radius: 0.52 },
    DROID_003: { label: 'DROID Scene 4', img: './assets/meshes/DROID_003/input.jpg', overlay: './assets/meshes/DROID_003/input_overlay.jpg', center: [0.298, -0.237, 1.718], radius: 0.42 },
    GEN_scene_00: { label: 'Generated Scene 1', img: './assets/meshes/GEN_scene_00/input.jpg', overlay: './assets/meshes/GEN_scene_00/input_overlay.jpg', center: [-0.144, -0.110, 0.945], radius: 0.28 },
    GEN_scene_01: { label: 'Generated Scene 2', img: './assets/meshes/GEN_scene_01/input.jpg', overlay: './assets/meshes/GEN_scene_01/input_overlay.jpg', center: [-0.129, -0.040, 1.338], radius: 0.62 },
    GEN_scene_02: { label: 'Generated Scene 3', img: './assets/meshes/GEN_scene_02/input.jpg', overlay: './assets/meshes/GEN_scene_02/input_overlay.jpg', center: [0.019, -0.011, 0.949], radius: 0.29 },
    GEN_scene_03: { label: 'Generated Scene 4', img: './assets/meshes/GEN_scene_03/input.jpg', overlay: './assets/meshes/GEN_scene_03/input_overlay.jpg', center: [-0.029, 0.111, 1.273], radius: 0.43 },
    GEN_scene_04: { label: 'Generated Scene 5', img: './assets/meshes/GEN_scene_04/input.jpg', overlay: './assets/meshes/GEN_scene_04/input_overlay.jpg', center: [-0.178, 0.057, 1.434], radius: 0.77 },
    GEN_scene_05: { label: 'Generated Scene 6', img: './assets/meshes/GEN_scene_05/input.jpg', overlay: './assets/meshes/GEN_scene_05/input_overlay.jpg', center: [0.097, 0.021, 1.045], radius: 0.29 },
    GEN_scene_06: { label: 'Generated Scene 7', img: './assets/meshes/GEN_scene_06/input.jpg', overlay: './assets/meshes/GEN_scene_06/input_overlay.jpg', center: [0.051, -0.010, 0.710], radius: 0.34 },
    GEN_scene_07: { label: 'Generated Scene 8', img: './assets/meshes/GEN_scene_07/input.jpg', overlay: './assets/meshes/GEN_scene_07/input_overlay.jpg', center: [0.154, 0.021, 0.962], radius: 0.34 },
    GEN_scene_08: { label: 'Generated Scene 9', img: './assets/meshes/GEN_scene_08/input.jpg', overlay: './assets/meshes/GEN_scene_08/input_overlay.jpg', center: [-0.003, 0.100, 0.824], radius: 0.37 },
  };
  // Expose scenes for mesh viewer
  window._sceneData = scenes;

  // Overlay fade-in animation: shows segmentation masks appearing over the input
  let overlayAnimTimer = null;
  let maskToggleOn = true; // user toggle state

  const maskToggle = document.getElementById('maskOverlayToggle');
  if (maskToggle) {
    maskToggle.addEventListener('change', () => {
      maskToggleOn = maskToggle.checked;
      if (!overlayImg) return;
      if (maskToggleOn) {
        overlayImg.style.opacity = '1';
      } else {
        if (overlayAnimTimer) clearTimeout(overlayAnimTimer);
        overlayImg.style.opacity = '0';
      }
    });
  }

  function startOverlayAnimation() {
    if (overlayAnimTimer) clearTimeout(overlayAnimTimer);
    if (!overlayImg) return;
    overlayImg.style.opacity = '0';
    if (!maskToggleOn) return; // respect user toggle
    overlayAnimTimer = setTimeout(() => {
      overlayImg.style.opacity = '1';
    }, 800);
  }

  // Sync the 3D viewer size with the input image
  function syncViewerToImage() {
    const meshViewer = document.getElementById('meshDesktopViewer');
    const inputFrame = document.getElementById('inputImageFrame');
    if (!inputImg || !meshViewer || !inputFrame) return;

    const w = inputImg.naturalWidth || inputImg.width;
    const h = inputImg.naturalHeight || inputImg.height;
    if (w && h) {
      meshViewer.style.aspectRatio = `${w} / ${h}`;
      // Wait for CSS reflow, then match exact height
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const inputHeight = inputFrame.offsetHeight;
          if (inputHeight > 0) {
            meshViewer.style.height = `${inputHeight}px`;
            meshViewer.style.aspectRatio = 'unset';
          }
          window.dispatchEvent(new Event('resize'));
        });
      });
    }
  }

  function updateInputImages(scene) {
    if (overlayImg) overlayImg.style.opacity = '0';
    if (overlayAnimTimer) clearTimeout(overlayAnimTimer);

    // Wait for both images to load before showing overlay
    let inputReady = false;
    let overlayReady = false;
    function tryReveal() {
      if (inputReady && overlayReady) startOverlayAnimation();
    }

    if (inputImg) {
      inputImg.onload = () => {
        inputReady = true;
        syncViewerToImage();
        tryReveal();
      };
      inputImg.src = scene.img;
      if (inputImg.complete) {
        inputReady = true;
        syncViewerToImage();
      }
    } else {
      inputReady = true;
    }

    if (overlayImg) {
      overlayImg.onload = () => { overlayReady = true; tryReveal(); };
      overlayImg.src = scene.overlay;
      if (overlayImg.complete) { overlayReady = true; }
    } else {
      overlayReady = true;
    }

    tryReveal();
    if (activeName) activeName.textContent = scene.label;
    const mobileImg = document.getElementById('gsplatMobileImg');
    if (mobileImg) mobileImg.src = scene.overlay;
  }

  // ── Build dataset / scene button selector ──
  const datasetBtns = document.getElementById('datasetBtns');
  const sceneBtns = document.getElementById('sceneBtns');
  if (!datasetBtns || !sceneBtns) return;

  // Explicit dataset groups
  const datasetOrder = ['HB_LMO', 'WN', 'HOPE', 'AV', 'DROID', 'GEN'];
  const datasetLabels = { HB_LMO: 'HB + LM-O', WN: 'ReOcS', HOPE: 'HOPE', AV: 'ArtVIP', DROID: 'DROID', GEN: 'Generated' };
  const datasetDescriptions = {
    HB_LMO: '6D pose estimation benchmark with household objects',
    WN: '6D pose estimation benchmark with high-quality stereo depth',
    HOPE: '6D pose estimation benchmark with toy grocery objects',
    AV: 'Synthetic dataset of digital-twin articulated objects',
    DROID: 'In-the-wild robot manipulation dataset',
    GEN: 'Sample generated image'
  };
  const datasets = {
    HB_LMO: ['HB_000003', 'HB_000005', 'HB_000006', 'HB_000007', 'HB_000008', 'LMO_000002'],
    WN: ['WN_000000', 'WN_000001', 'WN_000006'],
    HOPE: ['HOPE_000002', 'HOPE_000003', 'HOPE_000007'],
    AV: Object.keys(scenes).filter(k => k.startsWith('AV_')),
    DROID: ['DROID_000', 'DROID_001', 'DROID_002', 'DROID_003'],
    GEN: Object.keys(scenes).filter(k => k.startsWith('GEN_')),
  };
  const datasetDescEl = document.getElementById('inputDatasetDesc');

  let activeDataset = 'HB_LMO';
  let activeScene = 'HB_000003';

  function selectScene(key) {
    activeScene = key;
    sceneBtns.querySelectorAll('.scene-thumb').forEach(b =>
      b.classList.toggle('active', b.dataset.key === key)
    );
    const scene = scenes[key];
    if (scene) updateInputImages(scene);
    window._meshViewer?.loadScene(key);
  }

  function showDatasetScenes(prefix) {
    activeDataset = prefix;
    datasetBtns.querySelectorAll('.scene-dataset-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.prefix === prefix)
    );
    sceneBtns.innerHTML = '';
    sceneBtns.className = 'scene-thumbnails';
    const keys = datasets[prefix] || [];
    keys.forEach((key, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'scene-thumb' + (key === activeScene ? ' active' : '');
      thumb.dataset.key = key;

      const img = document.createElement('img');
      img.src = `./assets/meshes/${key}/input.jpg`;
      img.alt = `Scene ${idx + 1}`;
      img.loading = 'lazy';

      const number = document.createElement('span');
      number.className = 'scene-thumb-number';
      number.textContent = idx + 1;

      thumb.appendChild(img);
      thumb.appendChild(number);
      thumb.addEventListener('click', () => selectScene(key));
      sceneBtns.appendChild(thumb);
    });
    // Update dataset description
    if (datasetDescEl) {
      datasetDescEl.textContent = datasetDescriptions[prefix] || '';
    }
  }

  // Build dataset buttons
  datasetOrder.forEach(prefix => {
    if (!datasets[prefix]) return;
    const btn = document.createElement('button');
    btn.className = 'scene-dataset-btn' + (prefix === activeDataset ? ' active' : '');
    btn.dataset.prefix = prefix;
    btn.textContent = datasetLabels[prefix] || prefix;
    btn.addEventListener('click', () => {
      showDatasetScenes(prefix);
      // Auto-select first scene in dataset
      const firstKey = datasets[prefix][0];
      if (firstKey) selectScene(firstKey);
    });
    datasetBtns.appendChild(btn);
  });

  // Initial render
  showDatasetScenes('HB_LMO');
  startOverlayAnimation();

  // Sync viewer size on initial load once image is ready
  if (inputImg) {
    if (inputImg.complete && inputImg.naturalWidth) {
      syncViewerToImage();
    } else {
      inputImg.addEventListener('load', syncViewerToImage, { once: true });
    }
  }

  // Keep viewer synced on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(syncViewerToImage, 100);
  });
});

// ===== Mesh Viewer (lightweight alternative) =====
document.addEventListener('DOMContentLoaded', () => {
  const meshDesktop = document.getElementById('meshDesktopViewer');
  const canvas = document.getElementById('meshCanvas');
  const loadingEl = document.getElementById('meshLoading');
  const loadingText = loadingEl?.querySelector('.gsplat-loading-text');
  const progressFill = document.getElementById('meshProgress');

  if (!canvas || !meshDesktop) return;

  // Hide mesh viewer on mobile
  if (isMobileDevice()) {
    meshDesktop.style.display = 'none';
    return;
  }

  let THREE = null;
  let GLTFLoader = null;
  let OrbitControls = null;
  let meshConfig = null;
  let renderer = null;
  let scene = null;
  let camera = null;
  let controls = null;
  let animFrameId = null;
  let isLoading = false;

  // Scene keys map directly to mesh_config.json IDs
  const sceneKeyToId = (key) => key;

  // ── Dispose Three.js resources ──
  function disposeMesh() {
    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
    if (controls) { controls.dispose(); controls = null; }
    if (scene) {
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => { m.map?.dispose(); m.dispose(); });
          else { obj.material.map?.dispose(); obj.material.dispose(); }
        }
      });
      scene = null;
    }
    if (renderer) { renderer.dispose(); renderer = null; }
    camera = null;
  }

  // ── Build transform matrix matching prepare_scene_data.py ──
  function buildTransformMatrix(t) {
    // S: uniform scale
    const S = new THREE.Matrix4().makeScale(t.scale, t.scale, t.scale);

    // r90: 90-degree rotation around X (matches R.from_euler("xyz", [90,0,0]))
    const r90 = new THREE.Matrix4().makeRotationX(Math.PI / 2);

    // [R | t]: rotation_matrix + translation as 4x4
    // Python does xyz @ rot_mat.T + translation (row-vectors, right-multiply)
    // Equivalent column-vector form: rot_mat * v + t
    const rm = t.rotation_matrix;
    const Rt = new THREE.Matrix4().set(
      rm[0][0], rm[0][1], rm[0][2], t.translation[0],
      rm[1][0], rm[1][1], rm[1][2], t.translation[1],
      rm[2][0], rm[2][1], rm[2][2], t.translation[2],
      0, 0, 0, 1
    );

    // cam2ncam_inv: cam2ncam is row-major in JSON
    const c = t.cam2ncam;
    const cam2ncam = new THREE.Matrix4().set(
      c[0][0], c[0][1], c[0][2], c[0][3],
      c[1][0], c[1][1], c[1][2], c[1][3],
      c[2][0], c[2][1], c[2][2], c[2][3],
      c[3][0], c[3][1], c[3][2], c[3][3]
    );
    const cam2ncamInv = cam2ncam.clone().invert();

    // Full: cam2ncam_inv * Rt * r90 * S
    const result = new THREE.Matrix4();
    result.multiplyMatrices(cam2ncamInv, Rt);
    result.multiply(r90);
    result.multiply(S);
    return result;
  }

  // ── Load mesh scene ──
  async function loadMeshScene(sceneKey) {
    const sceneId = sceneKeyToId(sceneKey);
    if (!sceneId || isLoading) return;
    isLoading = true;
    loadingEl.classList.remove('hidden');
    progressFill.style.width = '0%';
    loadingText.textContent = 'Initializing...';

    disposeMesh();

    try {
      // Lazy-load Three.js modules
      if (!THREE) {
        loadingText.textContent = 'Loading 3D engine...';
        [THREE, { GLTFLoader }, { OrbitControls }] = await Promise.all([
          import('three'),
          import('three/addons/loaders/GLTFLoader.js'),
          import('three/addons/controls/OrbitControls.js')
        ]);
      }

      // Lazy-load mesh config
      if (!meshConfig) {
        loadingText.textContent = 'Loading scene config...';
        const resp = await fetch('./assets/meshes/mesh_config.json');
        if (!resp.ok) throw new Error(`Failed to load mesh config: ${resp.status}`);
        meshConfig = await resp.json();
      }

      const sceneCfg = meshConfig.scenes.find(s => s.id === sceneId);
      if (!sceneCfg) throw new Error('Scene not found: ' + sceneId);

      const center = sceneCfg.scene_center || [0, 0, 1];
      const radius = sceneCfg.scene_radius || 0.25;
      const camDist = radius * 4;

      // Set up renderer
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setClearColor(0xffffff, 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const rect = canvas.parentElement.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);

      // Scene + lighting
      scene = new THREE.Scene();
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      // Soft ambient fill
      scene.add(new THREE.AmbientLight(0xffffff, 1.5));
      // Key light (top-front)
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
      keyLight.position.set(0.5, -2, -1);
      scene.add(keyLight);
      // Fill light (opposite side, softer)
      const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
      fillLight.position.set(-1, -0.5, 1);
      scene.add(fillLight);
      // Rim light (from behind, subtle)
      const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
      rimLight.position.set(0, 0, 2);
      scene.add(rimLight);

      // Camera
      camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.01, 100);
      camera.up.set(0, -1, 0);
      camera.position.set(center[0], center[1] - camDist * 0.3, center[2] - camDist);
      camera.lookAt(center[0], center[1], center[2]);

      // Controls
      controls = new OrbitControls(camera, canvas);
      controls.target.set(center[0], center[1], center[2]);
      controls.minDistance = radius * 2;
      controls.maxDistance = radius * 10;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.update();

      // Load objects
      loadingText.textContent = 'Loading meshes...';
      progressFill.style.width = '10%';
      const loader = new GLTFLoader();
      const total = sceneCfg.objects.length;
      let loaded = 0;

      await Promise.all(sceneCfg.objects.map(obj =>
        new Promise((resolve, reject) => {
          loader.load(
            './assets/meshes/' + obj.glb,
            (gltf) => {
              // Fix materials: GLBs have no metallicFactor (defaults to 1.0 = full metal)
              // but these are ordinary diffuse objects, so force metalness to 0
              gltf.scene.traverse(child => {
                if (child.isMesh && child.material) {
                  const mats = Array.isArray(child.material) ? child.material : [child.material];
                  mats.forEach(mat => {
                    if (mat.isMeshStandardMaterial) {
                      mat.metalness = 0;
                      mat.roughness = 0.7;
                    }
                  });
                }
              });
              const m = buildTransformMatrix(obj.transform);
              gltf.scene.applyMatrix4(m);
              scene.add(gltf.scene);
              loaded++;
              progressFill.style.width = (10 + (loaded / total) * 85) + '%';
              loadingText.textContent = `Loading meshes... ${loaded}/${total}`;
              resolve();
            },
            undefined,
            reject
          );
        })
      ));

      progressFill.style.width = '100%';
      setTimeout(() => {
        loadingEl.classList.add('hidden');
        isLoading = false;
      }, 300);

      // Pendulum auto-rotation (same logic as GS viewer)
      let pendulumTime = 0;
      const pendulumSpeed = 0.008;
      const pendulumAmplitude = 0.4;
      let isUserInteracting = false;
      let interactionTimeout = null;
      let baseAngle = 0;

      canvas.addEventListener('pointerdown', () => {
        isUserInteracting = true;
        clearTimeout(interactionTimeout);
      });
      canvas.addEventListener('pointerup', () => {
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => { isUserInteracting = false; }, 2000);
      });
      canvas.addEventListener('wheel', () => {
        isUserInteracting = true;
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => { isUserInteracting = false; }, 2000);
      });

      const currentRenderer = renderer;
      const animate = () => {
        if (!currentRenderer || currentRenderer !== renderer) return;

        if (!isUserInteracting) {
          pendulumTime += pendulumSpeed;
          const swingAngle = baseAngle + Math.sin(pendulumTime) * pendulumAmplitude;
          const cx = center[0], cy = center[1], cz = center[2];
          const dx = camera.position.x - cx;
          const dy = camera.position.y - cy;
          const dz = camera.position.z - cz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const elevation = Math.asin(dy / dist);
          const horizDist = dist * Math.cos(elevation);
          camera.position.x = cx + horizDist * Math.sin(swingAngle);
          camera.position.z = cz - horizDist * Math.cos(swingAngle);
          camera.position.y = cy + dist * Math.sin(elevation);
          camera.lookAt(cx, cy, cz);
        } else {
          const dx = camera.position.x - center[0];
          const dz = camera.position.z - center[2];
          baseAngle = Math.atan2(dx, -dz);
          pendulumTime = 0;
        }

        controls.update();
        renderer.render(scene, camera);
        animFrameId = requestAnimationFrame(animate);
      };
      animFrameId = requestAnimationFrame(animate);

      // Handle resize
      const onResize = () => {
        if (!renderer || renderer !== currentRenderer) return;
        const r = canvas.parentElement.getBoundingClientRect();
        renderer.setSize(r.width, r.height, false);
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

    } catch (err) {
      console.error('Mesh viewer error:', err);
      loadingText.textContent = 'Error: ' + err.message;
      isLoading = false;
    }
  }

  window._meshViewer = { loadScene: loadMeshScene };

  // Load default scene on startup
  loadMeshScene('HB_000003');
});

// ===== TRELLIS Mesh Switcher =====
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('meshSelect');
  const raw = document.getElementById('meshRaw');
  const activeName = document.getElementById('meshActiveName');
  const video = document.getElementById('meshVideo');
  const note = document.getElementById('meshVideoNote');

  const meshes = {
    coke: { label: 'Coke', file: 'mesh_coke.glb', video: 'coke.mp4' },
    cleaner: { label: 'Cleaner', file: 'mesh_cleaner.glb', video: 'cleaner.mp4' },
    electricdrill: { label: 'Electric Drill', file: 'mesh_electricdrill.glb', video: 'electricdrill.mp4' },
    pot: { label: 'Pot', file: 'mesh_pot.glb', video: 'pot.mp4' },
    scissor: { label: 'Scissor', file: 'mesh_scissor.glb', video: 'scissor.mp4' },
    spoon: { label: 'Spoon', file: 'mesh_spoon.glb', video: 'spoon.mp4' }
  };

  const adjustVideoHeight = () => {
    if (video && video.videoWidth && video.videoHeight) {
      const aspectRatio = video.videoHeight / video.videoWidth;
      const containerWidth = video.offsetWidth || video.parentElement.offsetWidth;
      if (containerWidth > 0) {
        const h = containerWidth * aspectRatio;
        video.style.height = `${h}px`;
        if (raw) { raw.style.height = `${h}px`; raw.style.minHeight = `${h}px`; }
      }
    }
  };
  window.addEventListener('resize', adjustVideoHeight);

  const setMesh = (key) => {
    const entry = meshes[key];
    if (!entry || !raw) return;
    raw.setAttribute('src', `./assets/trellis/${entry.file}`);
    raw.setAttribute('camera-orbit', 'auto auto 600%');
    if (activeName) activeName.textContent = entry.label;
    if (video && entry.video) {
      video.src = `./assets/videos/objects/${entry.video}`;
      video.classList.remove('hidden');
      video.load();
      video.addEventListener('loadedmetadata', adjustVideoHeight);
      if (video.readyState >= 1) setTimeout(adjustVideoHeight, 100);
      video.play().catch(() => {});
      if (note) note.textContent = '';
    }
  };

  select?.addEventListener('change', (e) => setMesh(e.target.value));
  setMesh(select?.value || 'cleaner');
});


// ===== Image Comparison Slider =====
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('imageSlider');
  if (!slider) return;

  const input = slider.querySelector('.image-slider-input');
  const rightClip = slider.querySelector('.slider-img-right-clip');
  const handle = slider.querySelector('.slider-handle-bar');
  const leftImg = slider.querySelector('.slider-img-left');
  const rightImg = slider.querySelector('.slider-img-right');
  const leftLabel = slider.querySelector('.slider-label-left');
  const rightLabel = slider.querySelector('.slider-label-right');

  const sceneContainer = document.getElementById('sliderSceneSelector');
  const leftSelect = document.getElementById('leftMethodSelect');
  const rightSelect = document.getElementById('rightMethodSelect');

  // Flat scene list: interleaved datasets (HB, ReOcS, AV, HB, ReOcS, HB, HB, ReOcS, HB)
  const SCENES = [
    { dataset: 'HB',     scene: '000003' },
    { dataset: 'ReOcS',  scene: '000000' },
    { dataset: 'ArtVIP', scene: '000020' },
    { dataset: 'HB',     scene: '000005' },
    { dataset: 'ReOcS',  scene: '000001' },
    { dataset: 'HB',     scene: '000006' },
    { dataset: 'HB',     scene: '000007' },
    { dataset: 'ReOcS',  scene: '000003' },
  ];

  const METHOD_LABELS = {
    gt: 'Ground Truth', recgen: 'RecGen', sam3d: 'SAM3D',
    scenecomplete: 'SceneComplete', any6d_instantmesh: 'Any6D',
  };

  let currentIdx = 0;

  // --- Slider drag ---
  const updateSlider = (val) => {
    rightClip.style.clipPath = `inset(0 0 0 ${val}%)`;
    handle.style.left = val + '%';
  };
  input.addEventListener('input', (e) => updateSlider(Number(e.target.value)));
  updateSlider(50);

  // --- Image cache: preload all into memory ---
  const imgCache = {};
  const imgSrc = (dataset, scene, method) =>
    `./figs/results/slider/${dataset}/${scene}_${method}.png`;

  const preloadAll = () => {
    const methods = Object.keys(METHOD_LABELS);
    SCENES.forEach(({ dataset, scene }) => {
      methods.forEach(m => {
        const src = imgSrc(dataset, scene, m);
        const img = new Image();
        img.src = src;
        imgCache[src] = img;
      });
    });
  };

  // --- Swap both images simultaneously (no flash) ---
  const updateImages = () => {
    const { dataset, scene } = SCENES[currentIdx];
    const lm = leftSelect.value;
    const rm = rightSelect.value;
    const lSrc = imgSrc(dataset, scene, lm);
    const rSrc = imgSrc(dataset, scene, rm);

    const lCached = imgCache[lSrc];
    const rCached = imgCache[rSrc];

    const swap = () => {
      leftImg.src = lSrc;
      rightImg.src = rSrc;
      leftLabel.textContent = METHOD_LABELS[lm];
      rightLabel.textContent = METHOD_LABELS[rm];
    };

    // If both already loaded, swap instantly
    if (lCached?.complete && rCached?.complete) {
      swap();
      return;
    }

    // Otherwise wait for both, then swap together
    const promises = [];
    [lSrc, rSrc].forEach(src => {
      let cached = imgCache[src];
      if (!cached) { cached = new Image(); cached.src = src; imgCache[src] = cached; }
      if (!cached.complete) {
        promises.push(new Promise(res => { cached.onload = res; cached.onerror = res; }));
      }
    });

    if (promises.length === 0) { swap(); return; }
    Promise.all(promises).then(swap);
  };

  // --- Build scene thumbnails ---
  sceneContainer.innerHTML = '';
  sceneContainer.className = 'scene-thumbnails';
  SCENES.forEach((s, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'scene-thumb' + (i === 0 ? ' active' : '');

    const img = document.createElement('img');
    img.src = imgSrc(s.dataset, s.scene, 'gt');
    img.alt = `Scene ${i + 1}`;
    img.loading = 'lazy';

    const number = document.createElement('span');
    number.className = 'scene-thumb-number';
    number.textContent = i + 1;

    thumb.appendChild(img);
    thumb.appendChild(number);
    thumb.addEventListener('click', () => {
      sceneContainer.querySelectorAll('.scene-thumb').forEach(b => b.classList.remove('active'));
      thumb.classList.add('active');
      currentIdx = i;
      updateImages();
    });
    sceneContainer.appendChild(thumb);
  });

  // --- Method dropdowns ---
  // Disable options in the opposite select that match the current selection
  // so the same method can't be compared against itself.
  const syncDisabledOptions = () => {
    const lv = leftSelect.value;
    const rv = rightSelect.value;
    Array.from(leftSelect.options).forEach(o => { o.disabled = (o.value === rv); });
    Array.from(rightSelect.options).forEach(o => { o.disabled = (o.value === lv); });
  };
  const onMethodChange = () => { syncDisabledOptions(); updateImages(); };
  leftSelect.addEventListener('change', onMethodChange);
  rightSelect.addEventListener('change', onMethodChange);
  syncDisabledOptions();

  // --- Init ---
  preloadAll();
  updateImages();
});

// ===== Tab Navigation (scoped per tab-group) =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-nav[data-tab-group]').forEach(nav => {
    const btns = nav.querySelectorAll('.tab-btn');
    const card = nav.closest('.card-surface');
    const panels = card.querySelectorAll('.tab-panel');
    const tabGroup = nav.dataset.tabGroup;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById(btn.dataset.tab);
        if (panel) panel.classList.add('active');

        // Init multiview shape chart on first click
        if (tabGroup === 'multiview' && btn.dataset.tab === 'tab-multiview-shape') {
          if (typeof window.initMultiviewShapeChart === 'function') {
            window.initMultiviewShapeChart();
          }
        }

        // Resize charts in newly visible panel
        requestAnimationFrame(() => {
          if (typeof allResultCharts !== 'undefined') {
            allResultCharts.forEach(c => c.resize());
          }
        });
      });
    });
  });
});

// ===== Symmetry Comparison Viewer =====
document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('symmetryStage');
  const pager = document.getElementById('symmetryPager');
  if (!stage) return;

  const OBJECTS = [
    { id: 'hope_000003', count: 4 },
    { id: 'hope_000012', count: 4 },
    { id: 'hope_000025', count: 4 },
    { id: 'hb_000029',   count: 4 },
  ];
  const BASE = './assets/symmetry/';
  const METHODS = ['input', 'recgen', 'sam3d'];
  const COLS_DESKTOP = 8;
  const COLS_MOBILE = 4;
  const LABEL_DELAY = 2000;

  function getCols() {
    return window.innerWidth <= 768 ? COLS_MOBILE : COLS_DESKTOP;
  }

  const LABELS = {
    recgen: {
      'hope_000003/0': true,  'hope_000012/0': true,  'hope_000025/0': true,  'hb_000029/0': false,
      'hope_000003/1': true,  'hope_000012/1': true,  'hope_000025/1': true,  'hb_000029/1': true,
      'hope_000003/2': true,  'hope_000012/2': true,  'hope_000025/2': true,  'hb_000029/2': true,
      'hope_000003/3': true,  'hope_000012/3': true,  'hope_000025/3': true,  'hb_000029/3': true,
    },
    sam3d: {
      'hope_000003/0': false, 'hope_000012/0': false, 'hope_000025/0': true,  'hb_000029/0': false,
      'hope_000003/1': true,  'hope_000012/1': false, 'hope_000025/1': false, 'hb_000029/1': true,
      'hope_000003/2': false, 'hope_000012/2': false, 'hope_000025/2': true,  'hb_000029/2': false,
      'hope_000003/3': true,  'hope_000012/3': false, 'hope_000025/3': false, 'hb_000029/3': true,
    },
  };

  // Interleave: one sample from each object in round-robin
  const allSamples = [];
  const maxCount = Math.max(...OBJECTS.map(o => o.count));
  for (let i = 0; i < maxCount; i++) {
    OBJECTS.forEach(obj => {
      if (i < obj.count) allSamples.push({ id: obj.id, idx: i });
    });
  }

  // Split into pages based on current column count
  function buildPages() {
    const cols = getCols();
    const pages = [];
    for (let i = 0; i < allSamples.length; i += cols) {
      pages.push(allSamples.slice(i, i + cols));
    }
    return pages;
  }

  let pages = buildPages();
  let currentPage = 0;
  let labelTimer = null;
  let borderToggleOn = true;

  const borderToggle = document.getElementById('symmetryBorderToggle');
  if (borderToggle) {
    borderToggle.addEventListener('change', () => {
      borderToggleOn = borderToggle.checked;
      const grid = stage.querySelector('.symmetry-grid');
      if (!grid) return;
      if (borderToggleOn) {
        clearTimeout(labelTimer);
        grid.classList.add('show-verdicts');
      } else {
        clearTimeout(labelTimer);
        grid.classList.remove('show-verdicts');
      }
    });
  }

  function buildPage(pageIdx) {
    const samples = pages[pageIdx];
    const grid = document.createElement('div');
    grid.className = 'symmetry-grid';
    grid.style.gridTemplateColumns = `repeat(${samples.length}, 1fr)`;
    METHODS.forEach(method => {
      samples.forEach(s => {
        const cell = document.createElement('div');
        cell.className = 'symmetry-cell';
        if (method !== 'input') {
          const key = `${s.id}/${s.idx}`;
          const correct = LABELS[method]?.[key];
          if (correct === true) cell.dataset.verdict = 'correct';
          else if (correct === false) cell.dataset.verdict = 'wrong';
        }
        const img = document.createElement('img');
        img.src = `${BASE}${s.id}/sample_${s.idx}_${method}.jpg`;
        img.alt = `${method}`;
        img.loading = 'lazy';
        cell.appendChild(img);
        grid.appendChild(cell);
      });
    });
    return grid;
  }

  function showPage(idx) {
    currentPage = idx;
    clearTimeout(labelTimer);
    stage.innerHTML = '';
    stage.appendChild(buildPage(idx));
    if (pager) {
      pager.querySelectorAll('.symmetry-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    }
    if (borderToggleOn) {
      labelTimer = setTimeout(() => {
        const grid = stage.querySelector('.symmetry-grid');
        if (grid) grid.classList.add('show-verdicts');
      }, LABEL_DELAY);
    }
  }

  function rebuildPager() {
    if (!pager) return;
    pager.innerHTML = '';
    if (pages.length > 1) {
      pages.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'symmetry-dot' + (i === currentPage ? ' active' : '');
        dot.setAttribute('aria-label', `Page ${i + 1}`);
        dot.addEventListener('click', () => showPage(i));
        pager.appendChild(dot);
      });
    }
  }

  function rebuild() {
    pages = buildPages();
    if (currentPage >= pages.length) currentPage = pages.length - 1;
    rebuildPager();
    showPage(currentPage);
  }

  // Rebuild on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuild, 200);
  });

  rebuild();
});

// ===== Video Hover to Play =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.video-card-recon').forEach(card => {
    const video = card.querySelector('.video-hover');
    const thumb = card.querySelector('.video-thumb');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      thumb.style.opacity = '0';
      video.style.opacity = '1';
      video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      thumb.style.opacity = '1';
      video.style.opacity = '0';
      video.pause();
      video.currentTime = 0;
    });

    card.addEventListener('click', () => {
      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lightboxImg');
      lbImg.src = thumb.src;
      lb.classList.add('active');
    });
  });
});

// ===== Scroll Reveal Animation =====
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealElements.forEach(el => observer.observe(el));
});

// ===== Lightbox =====
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = lightbox?.querySelector('.lightbox-close');

  document.querySelectorAll('.comparison-full-image, .results-figure, .teaser-image').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });

  closeBtn?.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox?.classList.remove('active');
  });
});

// ===== Quantitative Results Charts =====
const allResultCharts = [];

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined' || typeof SHAPE_POSE_AVERAGES === 'undefined') return;

  Chart.register(ChartDataLabels);

  // ── Theme helpers ────────────────────────────────────────────────
  function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function themeColors() {
    return {
      text: getCSSVar('--text-secondary') || '#4a4a4a',
      muted: getCSSVar('--text-muted') || '#7a7a7a',
      grid: getCSSVar('--border-subtle') || 'rgba(0,0,0,0.06)',
      primary: getCSSVar('--text-primary') || '#1a1a1a',
    };
  }

  function applyTheme() {
    const tc = themeColors();
    allResultCharts.forEach(chart => {
      const s = chart.options.scales || {};
      ['x', 'y'].forEach(axis => {
        if (s[axis]) {
          if (s[axis].ticks) s[axis].ticks.color = tc.text;
          if (s[axis].grid) s[axis].grid.color = tc.grid;
          if (s[axis].title) s[axis].title.color = tc.text;
        }
      });
      if (chart.options.plugins.legend) chart.options.plugins.legend.labels.color = tc.text;
      if (chart.options.plugins.datalabels) chart.options.plugins.datalabels.color = tc.text;
      chart.update('none');
    });
  }

  new MutationObserver(applyTheme).observe(
    document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }
  );

  // ── Shared options factory ──────────────────────────────────────
  function baseOpts(extraPlugins) {
    const tc = themeColors();
    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 25, right: 10, bottom: 25 } },
      plugins: Object.assign({
        legend: { display: false },
        datalabels: { display: false },
      }, extraPlugins || {}),
      scales: {
        x: {
          ticks: {
            color: tc.primary,
            font: { family: 'Inter', size: 13, weight: '600' },
            callback: function(v) {
              const label = this.getLabelForValue(v);
              return typeof label === 'number' ? label.toLocaleString('en-US') : label;
            },
          },
          grid: { color: tc.grid },
        },
        y: {
          beginAtZero: true,
          ticks: { color: tc.primary, font: { family: 'Inter', size: 11 }, callback: (v) => v.toLocaleString('en-US') },
          grid: { color: tc.grid },
        },
      },
    };
  }

  function legendPlugin(tc) {
    return {
      display: true,
      position: 'top',
      labels: {
        color: tc.text,
        font: { family: 'Inter', size: 10 },
        boxWidth: 12, boxHeight: 12, borderRadius: 3,
        useBorderRadius: true,
        padding: 10,
      },
    };
  }

  function datalabelPlugin(tc, fmt, unit) {
    return {
      anchor: 'end',
      align: 'top',
      color: tc.text,
      font: { family: 'Inter', size: 8, weight: 'bold' },
      formatter: (v) => v == null ? '' : (fmt === '.0f' ? Math.round(v) + unit : v.toFixed(3) + unit),
      display: function(ctx) { return ctx.dataset.data[ctx.dataIndex] != null; },
    };
  }

  // ── Generic grouped bar chart ───────────────────────────────────
  function makeGroupedBar(canvasId, labels, methods, colors, metricData, fmt, unit) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    const tc = themeColors();

    const chartDatasets = methods.map((m, i) => ({
      label: m,
      data: labels.map(l => metricData[l] ? metricData[l][i] : null),
      backgroundColor: colors[i],
      borderColor: 'rgba(255,255,255,0.8)',
      borderWidth: 1,
      borderRadius: 3,
    }));

    const opts = baseOpts({
      legend: legendPlugin(tc),
      datalabels: datalabelPlugin(tc, fmt, unit),
    });
    opts.scales.x.ticks.font = { family: 'Inter', size: 12, weight: '600' };

    // Add headroom for percentage charts approaching 100%
    if (unit === '%') {
      const maxVal = Math.max(...chartDatasets.flatMap(ds => ds.data.filter(v => v != null)));
      if (maxVal > 80) opts.scales.y.max = Math.ceil(maxVal * 1.12);
    }

    const chart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: chartDatasets },
      options: opts,
    });
    allResultCharts.push(chart);
    return chart;
  }

  // ══════════════════════════════════════════════════════════════════
  // SECTION 1: Quantitative Comparison (Shape + Pose tabs)
  // ══════════════════════════════════════════════════════════════════

  function initQuantAvgCharts() {
    const avg = SHAPE_POSE_AVERAGES;
    const groups = avg.groups;
    const methods = avg.methods;
    const colors = avg.colors;

    // Shape tab: CD_norm
    makeGroupedBar('chartAvgCDNorm', groups, methods, colors, avg.CD_norm, '.3f', '');
    // Pose tab: ADD-SB and ADD-SB@0.05
    makeGroupedBar('chartAvgADDSB', groups, methods, colors, avg.ADDSS, '.3f', '');
    makeGroupedBar('chartAvgADDSB05', groups, methods, colors, avg.ADDSS_05, '.0f', '%');
  }

  let quantDetailInitialized = false;
  function initQuantDetailCharts() {
    if (quantDetailInitialized) return;
    quantDetailInitialized = true;

    const sp = SHAPE_POSE_PER_DATASET;
    const datasetKeys = ['HB', 'ReOcS', 'LMO', 'ArtVIP'];
    const datasetLabels = ['HB', 'ReOcS', 'LM-O', 'ArtVIP'];
    const methods = sp.methods;
    const colors = METHOD_COLORS_6;

    // Build metric data keyed by display label
    function buildMetric(key) {
      const result = {};
      datasetKeys.forEach((ds, i) => { result[datasetLabels[i]] = sp.datasets[ds][key]; });
      return result;
    }

    makeGroupedBar('chartDetailCDNorm', datasetLabels, methods, colors, buildMetric('CD_norm'), '.3f', '');
    makeGroupedBar('chartDetailADDSB', datasetLabels, methods, colors, buildMetric('ADDSS'), '.3f', '');
    makeGroupedBar('chartDetailADDSB05', datasetLabels, methods, colors, buildMetric('ADDSS_05'), '.0f', '%');
  }

  // View toggle for Section 1
  const quantToggle = document.getElementById('quantViewToggle');
  const sectionQuant = document.getElementById('section-quant');
  if (quantToggle && sectionQuant) {
    quantToggle.addEventListener('change', () => {
      if (quantToggle.checked) {
        sectionQuant.classList.add('show-detail');
        requestAnimationFrame(() => {
          initQuantDetailCharts();
          requestAnimationFrame(() => allResultCharts.forEach(c => c.resize()));
        });
      } else {
        sectionQuant.classList.remove('show-detail');
        requestAnimationFrame(() => allResultCharts.forEach(c => c.resize()));
      }
    });
  }

  // Init Section 1 average charts immediately (Shape tab is default active)
  initQuantAvgCharts();

  // ══════════════════════════════════════════════════════════════════
  // SECTION 2: Analysis of RecGen performance (Ablation)
  // ══════════════════════════════════════════════════════════════════

  let ablationInitialized = false;
  function initAblation() {
    if (ablationInitialized) return;
    ablationInitialized = true;

    // Populate ablation table
    const tbody = document.getElementById('ablationTableBody');
    if (!tbody) return;

    const abl = ABLATION_AGG;
    const metrics = [abl.obj_cd, abl.obj_addss, abl.part_cd, abl.part_addss];
    const fullVals = metrics.map(m => m[0]);

    abl.variants.forEach((variant, vi) => {
      const tr = document.createElement('tr');
      if (vi === 0) tr.classList.add('highlight-row');

      const tdName = document.createElement('td');
      tdName.textContent = variant;
      tr.appendChild(tdName);

      metrics.forEach((metricArr, mi) => {
        const [mean, median] = metricArr[vi];
        const td = document.createElement('td');
        let text = mean.toFixed(3) + ' / ' + median.toFixed(3);

        if (vi > 0) {
          const [fMean] = fullVals[mi];
          const pctMean = ((mean - fMean) / fMean * 100);
          const cls = pctMean > 2 ? 'delta-worse' : (pctMean < -2 ? 'delta-better' : 'delta-same');
          td.innerHTML = text + ' <span class="' + cls + '">(' + (pctMean >= 0 ? '+' : '') + Math.round(pctMean) + '%)</span>';
        } else {
          td.textContent = text;
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    // Ablation average charts (object-centric only)
    initAblationAvgCharts();
  }

  function initAblationAvgCharts() {
    const tc = themeColors();
    const ablAvg = ABLATION_AVG;
    const groups = ablAvg.groups;

    function makeAblAvgChart(canvasId, metricIdx) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return null;

      const chartDatasets = ablAvg.variants.map((variant, vi) => ({
        label: variant,
        data: groups.map(g => {
          const full = ablAvg.full[g][metricIdx];
          const val = ablAvg.data[variant][g][metricIdx];
          return ((val - full) / full * 100);
        }),
        backgroundColor: ablAvg.variantColors[vi],
        borderRadius: 3,
      }));

      const opts = baseOpts({
        legend: legendPlugin(tc),
        datalabels: {
          anchor: function(ctx) { return ctx.dataset.data[ctx.dataIndex] >= 0 ? 'end' : 'start'; },
          align: function(ctx) { return ctx.dataset.data[ctx.dataIndex] >= 0 ? 'top' : 'bottom'; },
          color: tc.text,
          font: { family: 'Inter', size: 9, weight: 'bold' },
          formatter: (v) => (v >= 0 ? '+' : '') + v.toFixed(1) + '%',
          display: 'auto',
        },
      });
      opts.scales.x.ticks.font = { family: 'Inter', size: 12, weight: '600' };

      const chart = new Chart(ctx, {
        type: 'bar',
        data: { labels: groups, datasets: chartDatasets },
        options: opts,
      });
      allResultCharts.push(chart);
      return chart;
    }

    makeAblAvgChart('chartAblationCDAvg', 0);
    makeAblAvgChart('chartAblationADDSBAvg', 1);
  }

  let ablationDetailInitialized = false;
  function initAblationDetailCharts() {
    if (ablationDetailInitialized) return;
    ablationDetailInitialized = true;

    const tc = themeColors();
    const ablPD = ABLATION_PER_DATASET;

    function makeAblationChart(canvasId, metricIdx) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return null;

      const chartDatasets = ablPD.variants.map((variant, vi) => ({
        label: variant,
        data: ablPD.datasets.map(ds => {
          const full = ablPD.full[ds][metricIdx];
          const val = ablPD.data[variant][ds][metricIdx];
          return ((val - full) / full * 100);
        }),
        backgroundColor: ablPD.variantColors[vi],
        borderRadius: 3,
      }));

      const opts = baseOpts({
        legend: legendPlugin(tc),
        datalabels: {
          anchor: function(ctx) { return ctx.dataset.data[ctx.dataIndex] >= 0 ? 'end' : 'start'; },
          align: function(ctx) { return ctx.dataset.data[ctx.dataIndex] >= 0 ? 'top' : 'bottom'; },
          color: tc.text,
          font: { family: 'Inter', size: 8, weight: 'bold' },
          formatter: (v) => (v >= 0 ? '+' : '') + Math.round(v) + '%',
          display: 'auto',
        },
      });
      opts.scales.x.ticks.font = { family: 'Inter', size: 12, weight: '600' };

      const chart = new Chart(ctx, {
        type: 'bar',
        data: { labels: ablPD.datasets, datasets: chartDatasets },
        options: opts,
      });
      allResultCharts.push(chart);
      return chart;
    }

    makeAblationChart('chartAblationCD', 0);
    makeAblationChart('chartAblationADDSB', 1);
  }

  // Ablation view toggle
  const ablationToggle = document.getElementById('ablationViewToggle');
  const sectionAblation = document.getElementById('section-ablation');
  if (ablationToggle && sectionAblation) {
    ablationToggle.addEventListener('change', () => {
      if (ablationToggle.checked) {
        sectionAblation.classList.add('show-detail');
        // Delay init so .view-detail is visible and Chart.js can measure dimensions
        requestAnimationFrame(() => {
          initAblationDetailCharts();
          requestAnimationFrame(() => allResultCharts.forEach(c => c.resize()));
        });
      } else {
        sectionAblation.classList.remove('show-detail');
        requestAnimationFrame(() => allResultCharts.forEach(c => c.resize()));
      }
    });
  }

  // ══════════════════════════════════════════════════════════════════
  // SECTION 3: Additional Analysis
  // ══════════════════════════════════════════════════════════════════

  // ── Occlusion Analysis ──────────────────────────────────────────
  function initOcclusionCharts() {
    const occ = OCCLUSION_ANALYSIS;
    const tc = themeColors();

    function makeOccChart(canvasId, metricData) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return null;

      const opts = baseOpts({
        legend: legendPlugin(tc),
        datalabels: datalabelPlugin(tc, '.3f', ''),
      });
      opts.scales.x.ticks.font = { family: 'Inter', size: 11, weight: '600' };

      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: occ.bins,
          datasets: occ.methods.map((m, i) => ({
            label: m,
            data: metricData[m],
            backgroundColor: occ.colors[i],
            borderColor: 'rgba(255,255,255,0.8)',
            borderWidth: 1,
            borderRadius: 3,
          })),
        },
        options: opts,
      });
      allResultCharts.push(chart);
      return chart;
    }

    makeOccChart('chartOcclusionCD', occ.CD_norm);
    makeOccChart('chartOcclusionADDSB', occ.ADDSS);
  }

  // ── Per-object horizontal bars ──────────────────────────────────
  function initPerObjectCharts() {
    const obj = PER_OBJECT_HB;
    const tc = themeColors();

    function makeHorizontalBar(canvasId, sam3dData, recgenData, label) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return null;

      // Sequential order: Obj 1 at top, Obj 33 at bottom
      // Reverse so Obj 1 appears at top of horizontal bar chart
      const sortedLabels = [...obj.objects].reverse();
      const sortedSAM3D = [...sam3dData].reverse();
      const sortedRecGen = [...recgenData].reverse();

      const opts = baseOpts({
        legend: legendPlugin(tc),
        datalabels: { display: false },
      });
      opts.indexAxis = 'y';
      opts.scales.x = {
        beginAtZero: true,
        ticks: { color: tc.text, font: { family: 'Inter', size: 9 }, callback: (v) => v.toLocaleString('en-US') },
        grid: { color: tc.grid },
        title: { display: true, text: label, color: tc.text, font: { family: 'Inter', size: 11 } },
      };
      opts.scales.y = {
        ticks: { color: tc.text, font: { family: 'Inter', size: 9 } },
        grid: { display: false },
      };

      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sortedLabels,
          datasets: [
            { label: 'SAM3D', data: sortedSAM3D, backgroundColor: COLORS.sam3d, borderRadius: 2 },
            { label: 'RecGen', data: sortedRecGen, backgroundColor: COLORS.recgen, borderRadius: 2 },
          ],
        },
        options: opts,
      });
      allResultCharts.push(chart);
      return chart;
    }

    makeHorizontalBar('chartObjCDNorm', obj.sam3d_cd, obj.recgen_cd, 'Normalized Chamfer Distance');
    makeHorizontalBar('chartObjADDSB', obj.sam3d_addss, obj.recgen_addss, 'ADD-SB');
  }

  // ── Multi-view Charts ──────────────────────────────────────────
  let multiviewChartCD = null;
  let multiviewChartADDSB = null;

  function makeMultiviewChart(canvasId, metricData) {
    if (typeof MULTIVIEW === 'undefined') return null;
    const mv = MULTIVIEW;
    const tc = themeColors();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const opts = baseOpts({
      legend: legendPlugin(tc),
      datalabels: datalabelPlugin(tc, '.3f', ''),
    });
    opts.scales.x.ticks.font = { family: 'Inter', size: 11, weight: '600' };

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: mv.datasets,
        datasets: mv.methods.map((method, i) => ({
          label: method,
          data: metricData[method],
          backgroundColor: mv.colors[i],
          borderColor: 'rgba(255,255,255,0.8)',
          borderWidth: 1,
          borderRadius: 3,
        })),
      },
      options: opts,
    });
    allResultCharts.push(chart);
    return chart;
  }

  function initMultiviewCharts() {
    if (typeof MULTIVIEW === 'undefined') return;
    if (!multiviewChartADDSB) {
      multiviewChartADDSB = makeMultiviewChart('chartMultiviewADDSB', MULTIVIEW.ADDSS);
    }
  }

  function initMultiviewShapeChart() {
    if (typeof MULTIVIEW === 'undefined') return;
    if (!multiviewChartCD) {
      multiviewChartCD = makeMultiviewChart('chartMultiviewCD', MULTIVIEW.CD_norm);
      // Force resize after creation since it was in a hidden tab
      requestAnimationFrame(() => {
        if (multiviewChartCD) multiviewChartCD.resize();
      });
    }
  }
  // Expose for tab click handler
  window.initMultiviewShapeChart = initMultiviewShapeChart;

  // ── VLM Alignment ──────────────────────────────────────────────
  function initVLMChart() {
    const vlm = VLM_ALIGNMENT;
    const tc = themeColors();
    const ctx = document.getElementById('chartVLMAlignment');
    if (!ctx) return;

    const opts = baseOpts({
      legend: legendPlugin(tc),
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: tc.text,
        font: { family: 'Inter', size: 9, weight: 'bold' },
        formatter: (v) => Math.round(v) + '%',
        display: true,
      },
    });
    opts.scales.x.ticks.font = { family: 'Inter', size: 11, weight: '600' };
    opts.scales.y.max = 110;
    opts.scales.y.ticks.callback = (v) => v + '%';

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: vlm.labels,
        datasets: [
          {
            label: 'SAM3D',
            data: vlm.sam3d,
            backgroundColor: vlm.colors.sam3d,
            borderColor: 'rgba(255,255,255,0.8)',
            borderWidth: 1,
            borderRadius: 3,
          },
          {
            label: 'RecGen',
            data: vlm.recgen,
            backgroundColor: vlm.colors.recgen,
            borderColor: 'rgba(255,255,255,0.8)',
            borderWidth: 1,
            borderRadius: 3,
          },
        ],
      },
      options: opts,
    });
    allResultCharts.push(chart);
  }

  // ── Lazy initialization via IntersectionObserver ─────────────────
  function lazyInit(elementId, initFn) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => initFn());
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    observer.observe(el);
  }

  // Section 2: Ablation (lazy)
  lazyInit('section-ablation', initAblation);

  // Symmetry section: VLM alignment chart (lazy)
  lazyInit('section-symmetry', initVLMChart);

  // Multi-view section: charts (lazy)
  lazyInit('chartMultiviewADDSB', initMultiviewCharts);

  // Section 3: Additional Analysis (lazy)
  lazyInit('section-additional', () => {
    initOcclusionCharts();
    initPerObjectCharts();
  });

  const compiledVideo = document.getElementById('compiledVideo');
  if (compiledVideo) {
    compiledVideo.playbackRate = 1;
    compiledVideo.addEventListener('ended', () => {
      compiledVideo.playbackRate = compiledVideo.playbackRate === 1 ? 0.2 : 1;
      compiledVideo.currentTime = 0;
      compiledVideo.play();
    });
  }
});
