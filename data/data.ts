import logistics from "./logistics.json";

export const data = [
  {
    id: "l",
    name: "Logistics",
    interpretation: JSON.stringify(logistics),
    plans: [
      `00: (     load-truck obj1 trub b1) [2.00]
01: (    drive-truck trub b1 b2 b) [1.00]
02: (     load-truck obj2 trub b2) [2.00]
03: (    drive-truck trub b2 ab b) [1.00]
04: (   unload-truck obj2 trub ab) [1.00]
05: (    drive-truck truc c2 c1 c) [1.00]
06: (     load-truck obj3 truc c1) [2.00]
07: (  load-airplane obj2 a380 ab) [1.00]
08: (    drive-truck truc c1 ac c) [1.00]
09: (   unload-truck obj3 truc ac) [1.00]
10: (   unload-truck obj1 trub ab) [1.00]
11: (  load-airplane obj1 a380 ab) [1.00]
12: (     fly-airplane a380 ab ac) [650.00]
13: (  load-airplane obj3 a380 ac) [1.00]
14: (     fly-airplane a380 ac ad) [100.00]
15: (unload-airplane obj1 a380 ad) [1.00]
16: (     fly-airplane a380 ad aa) [500.00]
17: (unload-airplane obj2 a380 aa) [1.00]
18: (unload-airplane obj3 a380 aa) [1.00]`,

      `00: (     load-truck obj1 trub b5) [2.00]
01: (    drive-truck trub b1 b2 b) [1.00]
02: (     load-truck obj2 trub b2) [2.00]
03: (    drive-truck trub b2 ab b) [1.00]
04: (   unload-truck obj2 trub ab) [1.00]
05: (    drive-truck truc c2 c1 c) [1.00]
06: (     load-truck obj3 truc c1) [2.00]
07: (  load-airplane obj2 a380 ab) [1.00]
08: (    drive-truck truc c1 ac c) [1.00]
09: (   unload-truck obj3 truc ac) [1.00]
10: (   unload-truck obj1 trub ab) [1.00]
11: (  load-airplane obj1 a380 ab) [1.00]
12: (     fly-airplane a380 ab ac) [650.00]
13: (  load-airplane obj3 a380 ac) [1.00]
14: (     fly-airplane a380 ac ad) [100.00]
15: (unload-airplane obj1 a380 ad) [1.00]
16: (     fly-airplane a380 ad aa) [500.00]
17: (unload-airplane obj2 a380 aa) [1.00]
18: (unload-airplane obj3 a380 aa) [1.00]`,

      `00: (     load-truck obj1 trub b7) [2.00]
01: (    drive-truck trub b1 b2 b) [1.00]
02: (     load-truck obj2 trub b2) [2.00]
03: (    drive-truck trub b2 ab b) [1.00]
04: (   unload-truck obj2 trub ab) [1.00]
05: (    drive-truck truc c2 c1 c) [1.00]
06: (     load-truck obj3 truc c1) [2.00]
07: (  load-airplane obj2 a380 ab) [1.00]
08: (    drive-truck truc c1 ac c) [1.00]
09: (   unload-truck obj3 truc ac) [1.00]
10: (   unload-truck obj1 trub ab) [1.00]
11: (  load-airplane obj1 a380 ab) [1.00]
12: (     fly-airplane a380 ab ac) [650.00]
13: (  load-airplane obj3 a380 ac) [1.00]
14: (     fly-airplane a380 ac ad) [100.00]
15: (unload-airplane obj1 a380 ad) [1.00]
16: (     fly-airplane a380 ad aa) [500.00]
17: (unload-airplane obj2 a380 aa) [1.00]
18: (unload-airplane obj3 a380 aa) [1.00]`,
    ],
  },
];
