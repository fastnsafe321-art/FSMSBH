import { Layers, Sprout, Shield, Building, Hammer, RotateCw, Waves } from 'lucide-react';
import { Expertise } from '../types';

/**
 * Expertise/Service categories data
 * Contains detailed information about each service offering
 */
export const EXPERTISE: Expertise[] = [
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
    caseStudies: [],
    gallery: [
      '/src/assets/images/artificial_turf_step1_excavation_blurred_1779791458406.png',
      '/src/assets/images/artificial_turf_step2_base_layer_blurred_1779791479525.png',
      '/src/assets/images/artificial_turf_step3_compaction_blurred_1779791496550.png',
      '/src/assets/images/artificial_turf_step4_shock_pad_blurred_1779791511331.png',
      '/src/assets/images/artificial_turf_step5_turf_laying_blurred_1779791529058.png',
      '/src/assets/images/artificial_turf_step6_infill_marking_blurred_1779791544054.png',
      '/src/assets/images/artificial_turf_brushing_1779108281366.png',
      '/src/assets/images/artificial_turf_seam_detail_1779108263687.png',
      '/src/assets/images/artificial_turf_macro_1779106602495.png'
    ]
  },
  { 
    name: 'NATURAL GRASS INSTALLATION', 
    icon: Sprout,
    image: '/src/assets/images/irrigated_sports_pitch_1779108101974.png', 
    desc: 'Top-tier natural turf solutions for professional pitches.',
    detailedDesc: 'Specializing in professional sports turf management, we provide highest-grade natural grass installation including soil analysis, irrigation design, and laser-guided leveling for elite competition surfaces.',
    features: [
      'Bermuda Hybrid Cultivars',
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
        image: "/src/assets/images/natural_sod_clean_blurred_workers_installation_1781170765388.png"
      },
      {
        step: "06",
        title: "Sod Rolling",
        desc: "Rolling the new turf with calibrated rollers to eliminate air pockets and guarantee absolute contact between sod and soil.",
        image: "/src/assets/images/natural_sod_workers_rolling_1781170444539.png"
      },
      {
        step: "07",
        title: "Immersive Watering",
        desc: "Thorough deep watering to help the grass settle, hydrate roots, and firmly seal the hybrid system base.",
        image: "/src/assets/images/natural_sod_watering_pro_1781170472132.png"
      },
      {
        step: "08",
        title: "Standard Maintenance",
        desc: "Regular high-precision mowing, smart watering loops, fertilizing, and aeration for resilient, healthy green sports grass.",
        image: "/src/assets/images/natural_grass_step8_maint_1779792948164.png"
      }
    ],
    caseStudies: [],
    gallery: [
      '/src/assets/images/natural_sod_clean_blurred_workers_installation_1781170765388.png',
      '/src/assets/images/natural_sod_watering_pro_1781170472132.png',
      '/src/assets/images/natural_grass_step8_maint_1779792948164.png',
      '/src/assets/images/natural_sod_workers_rolling_1781170444539.png',
      '/src/assets/images/irrigated_sports_pitch_1779108101974.png',
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
        desc: 'Installed 12m high retractable safety nets for multi-sport use.',
        result: 'Enhanced spectator and athlete safety.'
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
    caseStudies: [],
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
  { 
    name: 'CARPENTRY & WOOD WORKS', 
    icon: Hammer,
    image: '/src/assets/images/Img 1.jpg', 
    desc: 'High-end custom woodwork and precision carpentry installations.',
    detailedDesc: 'Our custom carpentry and woodwork division provides high-durability timber structures, deckings, structural frameworks, and bespoke wood details for equestrian, residential, and commercial complexes.',
    features: [
      'Bespoke Timber Joinery & Decking',
      'Structural Wood Framing & Roof Trusses',
      'Custom Stables & Paddock Woodworks',
      'Highly Durable Weatherproof Sealants',
      'Premium Kiln-Dried Hardwood Selection'
    ],
    installationSteps: [
      {
        step: "01",
        title: "Precision Measurement",
        desc: "Accurate physical site surveying and material optimization templates.",
        image: "/src/assets/images/carpentry_step1_measurement_1779793696843.png"
      },
      {
        step: "02",
        title: "Digital Design & Prep",
        desc: "Transforming technical blueprints into exact structural woodwork patterns.",
        image: "/src/assets/images/carpentry_step2_design_1779793721487.png"
      },
      {
        step: "03",
        title: "Material Selection",
        desc: "Selecting the highest grade of weatherproof and high-density timber material.",
        image: "/src/assets/images/carpentry_step3_materials_1779793737448.png"
      }
    ],
    gallery: [
      '/src/assets/images/Img 1.jpg',
      '/src/assets/images/Img 2.png',
      '/src/assets/images/image 3.png',
      '/src/assets/images/img 4.png',
      '/src/assets/images/imag 5.png',
      '/src/assets/images/img 6.png',
      '/src/assets/images/img 7.png',
      '/src/assets/images/img 8.png',
      '/src/assets/images/img  12.png',
      '/src/assets/images/carpentry_workshop_machinery_1779107547457.png',
      '/src/assets/images/carpentry_cnc_machine_1779108036737.png',
      '/src/assets/images/carpentry_custom_furniture_1779108464249.png',
      '/src/assets/images/carpentry_sanding_process_1779108479778.png',
      '/src/assets/images/gym_interior_woodwork_1779107757792.png'
    ]
  },
];
