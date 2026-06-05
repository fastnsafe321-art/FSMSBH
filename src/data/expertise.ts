import { Layers, Sprout, Shield, Building, RotateCw, Waves } from 'lucide-react';

export const EXPERTISE = [ 
    { 
    name: 'ARTIFICIAL GRASS INSTALLATION', 
    icon: Layers,
    image: '/src/assets/images/artificial_turf_macro_1779106602495.png', 
    desc: 'Professional synthetic turf systems for sports and leisure.',
    detailedDesc: 'Our artificial grass solutions are engineered to strict ISO 9001:2015 and ISO 14001:2015 international standards for premium quality, environmental safety, and high-tier performance. We conduct rigorous quality inspection loops, utilizing ISO-certified raw synthetic fibers and specialized sub-base engineering for elite competition fields.',
    features: [
      'FIFA Quality Pro Certified Surfaces',
      'Advanced Multi-layer Drainage Systems',
      'UV-Resistant & Non-Toxic Fiber Tech',
      'ISO 9001:2015 Material Quality Control',
      'Precision Turf Carpet Laying & Roll Alignment',
      'Comprehensive Seam Sealing Technology',
      'Professional Sand & Rubber Infilling',
      'Certified Seam Integrity Audits'
    ],
    installationSteps: [
      {
        step: "01",
        title: "Site Excavation",
        desc: "Excavation of the existing ground to the required depth and levels, establishing raw terrain grade.",
        image: "/src/assets/images/artificial_turf_step1_excavation_blurred_1779791458406.png"
      },
      {
        step: "02",
        title: "Base Layer Installation",
        desc: "Installation of the engineered base aggregate layer to establish foundational stability and rapid porous drainage.",
        image: "/src/assets/images/artificial_turf_step2_base_layer_blurred_1779791479525.png"
      },
      {
        step: "03",
        title: "Sub-Base Compaction",
        desc: "Precision mechanized heavy-duty vibrating compaction to create a completely solid, monolithic, and flat load-bearing surface.",
        image: "/src/assets/images/artificial_turf_step3_compaction_blurred_1779791496550.png"
      },
      {
        step: "04",
        title: "Shock Pad Installation",
        desc: "Unrolling high-density athletic elastic shock pads to absorb player terminal impacts and maximize safety.",
        image: "/src/assets/images/artificial_turf_step4_shock_pad_blurred_1779791511331.png"
      },
      {
        step: "05",
        title: "Artificial Grass Laying",
        desc: "Precision alignment, unrolling, cutting, and strategic seam sealing of turf carpet sheets to form a unified playing surface.",
        image: "/src/assets/images/artificial_turf_step5_turf_laying_blurred_1779791529058.png"
      },
      {
        step: "06",
        title: "Infill & Line Marking",
        desc: "Calibration of certified sand/organic infill layers and high-contrast professional pitch geometric marking.",
        image: "/src/assets/images/artificial_turf_step6_infill_marking_blurred_1779791544054.png"
      }
    ],
    caseStudies: [
      {
        title: 'Hoora Youth Centre (Football)',
        result: 'Installed 12,000sqm of premium turf, reducing maintenance costs by 60%.'
      },
      {
        title: 'Bahrain School - Juffair',
        result: 'Designed a high-usage student field with advanced impact attenuation.'
      },
      {
        title: 'Professional Turf Carpet Laying',
        desc: 'Precision unrolling, cutting, and geometric alignment of artificial grass carpet rolls to form a perfectly continuous playing surface.',
        result: 'Seamless layout and precise alignment of carpet rolls.',
        image: '/src/assets/images/artificial_turf_step5_turf_laying_blurred_1779791529058.png'
      },
      {
        title: 'Technical Infill & Seam Integrity',
        desc: 'Rigorous digital depth gauge calibration and certified seam integrity auditing to ensure precise 45mm infill depth and bulletproof seam seals.',
        result: 'Achieved 45mm precise infill depth with verified Seam Integrity.',
        image: '/src/assets/images/artificial_turf_step6_infill_marking_blurred_1779791544054.png'
      }
    ],
    gallery: [
      '/src/assets/images/stadium_floodlights_1779107777323.png',
      '/src/assets/images/artificial_turf_step5_turf_laying_blurred_1779791529058.png',
      '/src/assets/images/artificial_turf_step6_infill_marking_blurred_1779791544054.png',
      '/src/assets/images/artificial_turf_seam_detail_1779108263687.png',
      '/src/assets/images/artificial_turf_macro_1779106602495.png',
      '/src/assets/images/artificial_turf_step3_compaction_blurred_1779791496550.png',
      '/src/assets/images/hero_stadium_turf_1779106585425.png',
      '/src/assets/images/bahrain_fifa_stadium_1779283699621.png',
      '/src/assets/images/sub_pitch_aeration_1779789441283.png',
      '/src/assets/images/riffa_putting_green_1779283737960.png'
    ]
  },
  { 
    name: 'NATURAL GRASS INSTALLATION', 
    icon: Sprout,
    image: '/src/assets/images/hero_stadium_turf_1779106585425.png', 
    desc: 'Top-tier natural turf solutions for professional pitches.',
    detailedDesc: 'Specializing in professional sports turf management, we provide highest-grade natural grass installation including soil analysis, irrigation design, and laser-guided leveling for elite competition surfaces.',
    features: [
      'Bermuda & Paspalum Hybrid Cultivars',
      'Laser-Guided Leveling & Grading',
      'Smart Automatic Irrigation Systems',
      'Scientific Soil & Nutrient Profiling',
      'Professional Grooming & Aeration'
    ],
    installationSteps: [
      {
        step: "01",
        title: "Site Preparation",
        desc: "Clearing the area and removing existing vegetation, debris, and rocks.",
        image: "/src/assets/images/natural_grass_step1_prep_1779792825609.png"
      },
      {
        step: "02",
        title: "Grading & Leveling",
        desc: "Precision grading and leveling the ground to ensure proper hydraulic slope and smooth surface.",
        image: "/src/assets/images/natural_grass_step2_grad_1779792841525.png"
      },
      {
        step: "03",
        title: "Soil Preparation",
        desc: "Loosening the soil and adding customized organic amendment matter or sand to improve root drainage.",
        image: "/src/assets/images/natural_grass_step3_soil_1779792859511.png"
      },
      {
        step: "04",
        title: "Base Layer Creation",
        desc: "Laying an engineered sandy topsoil base layer aggregate for rapid root development and excellent drainage.",
        image: "/src/assets/images/natural_grass_step4_base_1779792877380.png"
      },
      {
        step: "05",
        title: "Turf Laying",
        desc: "Unrolling certified premium natural grass turf rolls/sod tightly to avoid gaps and promote quick rooting.",
        image: "/src/assets/images/natural_grass_step5_turf_1779792898400.png"
      },
      {
        step: "06",
        title: "Sod Rolling",
        desc: "Rolling the new turf with calibrated rollers to eliminate air pockets and guarantee absolute contact between sod and soil.",
        image: "/src/assets/images/natural_grass_step6_roll_1779792913071.png"
      },
      {
        step: "07",
        title: "Immersive Watering",
        desc: "Thorough deep watering to help the grass settle, hydrate roots, and firmly seal the hybrid system base.",
        image: "/src/assets/images/natural_grass_step7_watr_1779792931008.png"
      },
      {
        step: "08",
        title: "Standard Maintenance",
        desc: "Regular high-precision mowing, smart watering loops, fertilizing, and aeration for resilient, healthy green sports grass.",
        image: "/src/assets/images/natural_grass_step8_maint_1779792948164.png"
      }
    ],
    caseStudies: [
      {
        title: 'Premier League Stadium Pitch',
        result: 'Achieved 98% turf density in 6 weeks with sub-surface aeration.'
      },
      {
        title: 'Private Estate Landscape',
        result: 'Implemented low-water hybrid grass for harsh desert conditions.'
      }
    ],
    gallery: [
      '/src/assets/images/natural_grass_step5_turf_1779792898400.png',
      '/src/assets/images/natural_grass_step7_watr_1779792931008.png',
      '/src/assets/images/natural_grass_step8_maint_1779792948164.png',
      '/src/assets/images/natural_grass_step6_roll_1779792913071.png',
      '/src/assets/images/hero_stadium_turf_1779106585425.png',
      '/src/assets/images/drainage_trench_blurred_1779790511693.png'
    ]
  },
  { 
    name: 'FENCING WORKS', 
    icon: Shield,
    image: '/src/assets/images/fencing_work_installation_1779107563771.png', 
    desc: 'Secure perimeter and sports-specific fencing solutions.',
    detailedDesc: 'We provide heavy-duty security and sports fencing systems. Our solutions range from anti-climb palisade fencing for industrial facilities to high-impact safety netting for athletic stadiums.',
    features: [
      'Galvanized & Powder Coated Steel',
      'High-Impact Sport Safety Netting',
      'Anti-Climb Palisade & Razor Wire',
      'Heavy-Duty Automated Sliding Gates',
      'Custom Mesh Panel Systems'
    ],
    caseStudies: [
      {
        title: 'Industrial Plant Perimeter',
        result: 'Secured 3km boundary with 3m high anti-climb palisade system.'
      },
      {
        title: 'City Sports Complex Netting',
        desc: 'Installed 12m high retractable safety nets for multi-sport use.'
      }
    ],
    gallery: [
      '/src/assets/images/fencing_work_installation_1779107563771.png',
      '/src/assets/images/palisade_security_fence_1779108020060.png',
      '/src/assets/images/fence_security_detail_1779107792940.png',
      '/src/assets/images/fencing_sports_netting_1779108316007.png',
      '/src/assets/images/fencing_heavy_gate_1779108334518.png'
    ]
  },
  { 
    name: 'BUILDING CONSTRUCTION', 
    icon: Building,
    image: '/src/assets/images/building_construction_site_1779107581243.png', 
    desc: 'Comprehensive civil works and turnkey building projects.',
    detailedDesc: 'From shoring and excavation to structural concrete and turnkey delivery, our civil engineering department handles complex building projects with a zero-incident safety commitment.',
    features: [
      'Advanced Shoring & Deep Excavation',
      'Structural Reinforced Concrete',
      'Turnkey Project Management',
      'Technical Blueprint Analysis',
      'MEP Integration & Civil Works'
    ],
    caseStudies: [
      {
        title: 'Apartment Complex Foundation',
        result: 'Completed 2-level basement excavation with zero soil shifts.'
      },
      {
        title: 'Commercial Hub Construction',
        result: 'Turnkey delivery of a 4-story retail center in 14 months.'
      }
    ],
    gallery: [
      '/src/assets/images/building_construction_site_1779107581243.png',
      '/src/assets/images/structural_concrete_pillars_1779108083297.png',
      '/src/assets/images/construction_blueprint_still_1779112823648.png',
      '/src/assets/images/concrete_pouring_foundation_1779108366053.png',
      '/src/assets/images/pool_construction_site_1779107512639.png'
    ]
  },
  { 
    name: 'HORSE WALKER INSTALLATION', 
    icon: RotateCw,
    image: '/src/assets/images/bahrain_horse_walker_1779781871906.png',
    desc: 'Specialized industrial equine exercise systems.',
    detailedDesc: 'We install premium automated horse walkers and equine fitness systems. Our designs emphasize horse safety, durable industrial electronics, and custom non-slip flooring.',
    features: [
      'Automated Variable Speed Control',
      'Anti-Slip Rubber Floor Systems',
      'Durable Industrial Drive Motors',
      'Custom Galvanized Guard Rails',
      'Emergency Stop & Safety Sensors'
    ],
    caseStudies: [
      {
        title: 'Royal Stables Refurbishment',
        result: 'Installed 4 automated walkers with custom desert-grade shielding.'
      },
      {
        title: 'Equestrian Center Expansion',
        result: 'Integrated walker control systems with central farm management.'
      }
    ],
    gallery: [
      '/src/assets/images/bahrain_horse_walker_1779781871906.png',
      '/src/assets/images/horse_walker_paddock_horses_1779108052144.png',
      '/src/assets/images/horse_walker_rubber_floor_1779108389578.png',
      '/src/assets/images/horse_walker_control_panel_1779108407100.png',
      '/src/assets/images/equestrian_paddock_1779107810078.png',
      '/src/assets/images/rashid_equestrian_stables_1779283381737.png',
      '/src/assets/images/rashid_racetrack_grandstand_1779283405835.png'
    ]
  },
  { 
    name: 'SWIMMING POOL CONSTRUCTION', 
    icon: Waves,
    image: '/src/assets/images/pool_construction_site_1779107512639.png', 
    desc: 'Professional concrete pool shells and turnkey aquatic works.',
    detailedDesc: 'Our swimming pool division handles complete construction from structural concrete shells to advanced filtration systems and artistic tile finishes for luxury residences and hotels.',
    features: [
      'Reinforced Concrete Pool Shells',
      'Advanced Salt-Water Chlorination',
      'Infinity Edge & Overflow Design',
      'LED Underwater Lighting Systems',
      'Custom Mosaic Tiling & Waterproofing'
    ],
    caseStudies: [
      {
        title: 'Resort Aquatic Complex',
        result: 'Constructed Olympic-sized training pool and leisure lagoon.'
      },
      {
        title: 'Private Villa Infinity Pool',
        result: 'Engineered suspended pool shell with panoramic ocean views.'
      }
    ],
    gallery: [
      '/src/assets/images/pool_construction_site_1779107512639.png',
      '/src/assets/images/pool_tiling_detail_1779107736835.png',
      '/src/assets/images/swimming_pool_pumps_room_1779108424776.png',
      '/src/assets/images/completed_infinity_pool_night_1779108439524.png',
      '/src/assets/images/pool_tiling_process_detail_1779112845511.png'
    ]
  },
];
