const mapCoords = {
  ladakh: {
    x: 3920.4093780780095,
    y: 102.58524578137599,
  },
  andhra: {
    x: 5671.079645458925,
    y: 3655.8188855275594,
  },
  delhi: {
    x: 4327.743261964435,
    y: 1766.5026755982403,
  },
  arunanchal: {
    x: 7586.713268381054,
    y: 1558.9010297422965,
  },
  assam: {
    x: 7579.5391329603735,
    y: 1848.7699908030863,
  },
  bihar: {
    x: 5539.3230843997135,
    y: 2032.56125427797,
  },
  chattishgarh: {
    x: 5428.793290936313,
    y: 2703.7353468604706,
  },
  goa: {
    x: 3694.797568322103,
    y: 4297.315986911655,
  },
  gujarat: {
    x: 3420.8838645340556,
    y: 2585.5758286340147,
  },
  haryana: {
    x: 4283.879092093515,
    y: 1357.8492613176973,
  },
  himachal: {
    x: 4227.123396944655,
    y: 896.3150585677411,
  },
  jammu: {
    x: 3885.9461512516145,
    y: 494.48134071451597,
  },
  jharkhand: {
    x: 6157.50620529128,
    y: 2437.313860738107,
  },
  karnataka: {
    x: 4336.329605091664,
    y: 3803.881401563388,
  },
  kerala: {
    x: 3898.914660062429,
    y: 4851.9005664168535,
  },
  madhya: {
    x: 4527.024371332095,
    y: 2165.495291041966,
  },
  maharastra: {
    x: 3830.435007724731,
    y: 3106.464962111533,
  },
  manipur: {
    x: 7307.67485803001,
    y: 2322.1036233565,
  },
  meghalaya: {
    x: 6947.90322351344,
    y: 2256.5397848189778,
  },
  mizoram: {
    x: 7061.569874489515,
    y: 2561.498629383428,
  },
  nagaland: {
    x: 7460.322276380615,
    y: 2040.2568413472534,
  },
  odisha: {
    x: 5905.253104231313,
    y: 2980.1197234573083,
  },
  punjab: {
    x: 4102.264731072479,
    y: 1028.5551241609205,
  },
  rajasthan: {
    x: 3775.8759349641787,
    y: 1510.8484847720483,
  },
  sikkim: {
    x: 6308.491396119248,
    y: 1882.4192164565934,
  },
  tamil: {
    x: 4836.530945211369,
    y: 4720.22987181003,
  },
  telagana: {
    x: 4539.183139564531,
    y: 3528.1115488535424,
  },
  tripura: {
    x: 6968.174609147524,
    y: 2564.150150820683,
  },
  uttarakhand: {
    x: 4659.093873229502,
    y: 1257.4565685789012,
  },
  uttarpradesh: {
    x: 4413.6629148015545,
    y: 1468.007912277893,
  },
  westbengal: {
    x: 6309.52620939645,
    y: 2060.3143650163283,
  },
};

const defaultCoords = [
  {
    x: 3039.6939562750404,
    y: 2927.89078687601,
  },
  {
    x: 4208.878483974997,
    y: 2897.6671366852365,
  },
  {
    x: 4258.115766598764,
    y: 3127.0402529301273,
  },
  {
    x: 6185.575158383702,
    y: 1442.9182837439214,
  },
  {
    x: 7331.469078018069,
    y: 1390.7385478361025,
  },
  {
    x: 4805.805914774268,
    y: 4481.938413482516,
  },
  {
    x: 5461.189482058892,
    y: 2173.2160297189507,
  },
  {
    x: 3105.8864157006556,
    y: 4151.829152271164,
  },
  {
    x: 4200.353179098513,
    y: 1383.0575796123294,
  },
  {
    x: 4846.043841717447,
    y: 1948.452192703166,
  },
  {
    x: 4359.731290406261,
    y: 2164.749373784438,
  },
  {
    x: 6078.370049585595,
    y: 4445.015477528559,
  },
  {
    x: 5155.653007637155,
    y: 2480.748674813468,
  },
  {
    x: 2273.9031749851706,
    y: 1604.0224103939306,
  },
  {
    x: 5871.648229631017,
    y: 2302.3742748294444,
  },
  {
    x: 4726.490135610828,
    y: 290.0350086141898,
  },
  {
    x: 3892.708543754453,
    y: 3747.0981919594806,
  },
  {
    x: 3852.886486755228,
    y: 2456.0415727961736,
  },
  {
    x: 6129.6706655877215,
    y: 3273.3382793736337,
  },
  {
    x: 7026.409946892877,
    y: 3271.8760388402643,
  },
  {
    x: 3098.218184910098,
    y: 1335.8034229439022,
  },
  {
    x: 6919.080675611775,
    y: 1449.181454199424,
  },
  {
    x: 3115.2781177404595,
    y: 2307.066880407704,
  },
  {
    x: 7652.934807878908,
    y: 2226.0206967285703,
  },
  {
    x: 3521.9374257306945,
    y: 2163.6720874471666,
  },
  {
    x: 3443.5293549738153,
    y: 2957.0111901090945,
  },
  {
    x: 5398.679717835995,
    y: 3674.4991678994393,
  },
  {
    x: 3683.617184008396,
    y: 3032.0406897071143,
  },
  {
    x: 5533.4787369656115,
    y: 2799.481183665851,
  },
  {
    x: 6347.059621277248,
    y: 3535.125185843838,
  },
  {
    x: 3411.08328263533,
    y: 1158.9399851745998,
  },
];
