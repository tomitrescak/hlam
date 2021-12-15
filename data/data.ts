import logistics from "./logistics.json";
import depot from "./depot.json";

export const data = [
  {
    id: "l",
    name: "Logistics",
    interpretation: JSON.stringify(logistics),
    domain: `;; logistics domain Typed version.
;;

(define (domain logistics)
  (:requirements :strips :typing) 
  (:types truck
          airplane - vehicle
          package
          vehicle - physobj
          airport
          location - place
          city
          place 
          physobj - object)
  
  (:predicates 	(in-city ?loc - place ?city - city)
    (at ?obj - physobj ?loc - place)
    (in ?pkg - package ?veh - vehicle))
  
(:action LOAD-TRUCK
    :parameters    (?pkg - package ?truck - truck ?loc - place)
    :precondition  (and (at ?truck ?loc) (at ?pkg ?loc))
    :effect        (and (not (at ?pkg ?loc)) (in ?pkg ?truck)))

(:action LOAD-AIRPLANE
  :parameters   (?pkg - package ?airplane - airplane ?loc - place)
  :precondition (and (at ?pkg ?loc) (at ?airplane ?loc))
  :effect       (and (not (at ?pkg ?loc)) (in ?pkg ?airplane)))

(:action UNLOAD-TRUCK
  :parameters   (?pkg - package ?truck - truck ?loc - place)
  :precondition (and (at ?truck ?loc) (in ?pkg ?truck))
  :effect       (and (not (in ?pkg ?truck)) (at ?pkg ?loc)))

(:action UNLOAD-AIRPLANE
  :parameters    (?pkg - package ?airplane - airplane ?loc - place)
  :precondition  (and (in ?pkg ?airplane) (at ?airplane ?loc))
  :effect        (and (not (in ?pkg ?airplane)) (at ?pkg ?loc)))

(:action DRIVE-TRUCK
  :parameters (?truck - truck ?loc-from - place ?loc-to - place ?city - city)
  :precondition
    (and (at ?truck ?loc-from) (in-city ?loc-from ?city) (in-city ?loc-to ?city))
  :effect
    (and (not (at ?truck ?loc-from)) (at ?truck ?loc-to)))

(:action FLY-AIRPLANE
  :parameters (?airplane - airplane ?loc-from - airport ?loc-to - airport)
  :precondition
    (at ?airplane ?loc-from)
  :effect
    (and (not (at ?airplane ?loc-from)) (at ?airplane ?loc-to)))
)
    `,
    plans: [
      {
        problem: `(define (problem logistics-4-0)
        (:domain logistics)
        (:objects
          A380 A381 - airplane
          aA aB aC aD - airport
          A1 A2 B1 B2 C1 C2 D1 D2 - location
          A B C D - city
          truA truB truC truD - truck
          obj1 obj2 obj3 - package
        )
      
        (:init
          (= (total-cost) 0)
          (= (distance aA aB) 300)
          (= (distance aB aA) 300)
          (= (distance aA aC) 600)
          (= (distance aC aA) 600)
          (= (distance aA aD) 500)
          (= (distance aD aA) 500)
          (= (distance aB aC) 650)
          (= (distance aC aB) 650)
          (= (distance aB aD) 450)
          (= (distance aD aB) 450)
          (= (distance aC aD) 100)
          (= (distance aD aC) 100)
          (at A380 aB)
          (at A381 aC)
      
          (at truA A2)
          (at truB B1)
          (at truC C2)
          (at truD D1)
      
          (at obj1 B1)
          (at obj2 B2)
          (at obj3 C1)
      
          (in-city aA A)
          (in-city A1 A)
          (in-city A2 A)
          (in-city aB B)
          (in-city B1 B)
          (in-city B2 B)
          (in-city aC C)
          (in-city C1 C)
          (in-city C2 C)
          (in-city aD D)
          (in-city D1 D)
          (in-city D2 D)
      
        )
      
        (:goal
          (and
            (at obj1 aD)
            (at obj2 aA)
            (at obj3 aA))
        )
      
        (:metric minimize
          (total-cost)
        )
      )
      `,
        result: `00: (     load-truck obj1 trub b1) [2.00]
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
      },
      {
        problem: `(define (problem logistics-6-0)
(:domain logistics)
(:objects
  apn1 - airplane
  apt2 apt1 - airport
  pos2 pos1 - location
  cit2 cit1 - city
  tru2 tru1 - truck
  obj23 obj22 obj21 obj13 obj12 obj11 - package)

(:init (at apn1 apt1) (at tru1 pos1) (at obj11 pos1)
  (at obj12 pos1) (at obj13 pos1) (at tru2 pos2) (at obj21 pos2) (at obj22 pos2)
  (at obj23 pos2) (in-city pos1 cit1) (in-city apt1 cit1) (in-city pos2 cit2)
  (in-city apt2 cit2))

(:goal (and (at obj12 apt2) (at obj23 apt1) (at obj21 apt2) (at obj22 pos2)
            (at obj13 pos2) (at obj11 apt2)))
)
        `,
        result: `00: (     load-truck obj13 tru1 pos1) [1.00]
01: (     load-truck obj11 tru1 pos1) [1.00]
02: (     load-truck obj12 tru1 pos1) [1.00]
03: (drive-truck tru1 pos1 apt1 cit1) [1.00]
04: (   unload-truck obj13 tru1 apt1) [1.00]
05: (   unload-truck obj12 tru1 apt1) [1.00]
06: (  load-airplane obj13 apn1 apt1) [1.00]
07: (  load-airplane obj12 apn1 apt1) [1.00]
08: (   unload-truck obj11 tru1 apt1) [1.00]
09: (  load-airplane obj11 apn1 apt1) [1.00]
10: (    fly-airplane apn1 apt1 apt2) [1.00]
11: (unload-airplane obj13 apn1 apt2) [1.00]
12: (unload-airplane obj12 apn1 apt2) [1.00]
13: (     load-truck obj23 tru2 pos2) [1.00]
14: (drive-truck tru2 pos2 apt2 cit2) [1.00]
15: (   unload-truck obj23 tru2 apt2) [1.00]
16: (  load-airplane obj23 apn1 apt2) [1.00]
17: (unload-airplane obj11 apn1 apt2) [1.00]
18: (    fly-airplane apn1 apt2 apt1) [1.00]
19: (     load-truck obj13 tru2 apt2) [1.00]
20: (drive-truck tru2 apt2 pos2 cit2) [1.00]
21: (     load-truck obj21 tru2 pos2) [1.00]
22: (   unload-truck obj13 tru2 pos2) [1.00]
23: (drive-truck tru2 pos2 apt2 cit2) [1.00]
24: (unload-airplane obj23 apn1 apt1) [1.00]
25: (   unload-truck obj21 tru2 apt2) [1.00]`,
      },
      {
        problem: `(define (problem logistics-6-1)
(:domain logistics)
(:objects
  apn1 - airplane
  apt2 apt1 - airport
  pos2 pos1 - location
  cit2 cit1 - city
  tru2 tru1 - truck
  obj23 obj22 obj21 obj13 obj12 obj11 - package)

(:init (at apn1 apt1) (at tru1 pos1) (at obj11 pos1)
  (at obj12 pos1) (at obj13 pos1) (at tru2 pos2) (at obj21 pos2) (at obj22 pos2)
  (at obj23 pos2) (in-city pos1 cit1) (in-city apt1 cit1) (in-city pos2 cit2)
  (in-city apt2 cit2))

(:goal (and (at obj11 pos1) (at obj22 apt2) (at obj23 pos2) (at obj12 apt1)
            (at obj13 pos2) (at obj21 pos2)))
)
        `,
        result: `00: (     load-truck obj22 tru2 pos2) [1.00]
01: (     load-truck obj12 tru1 pos1) [1.00]
02: (drive-truck tru2 pos2 apt2 cit2) [1.00]
03: (   unload-truck obj22 tru2 apt2) [1.00]
04: (     load-truck obj13 tru1 pos1) [1.00]
05: (drive-truck tru1 pos1 apt1 cit1) [1.00]
06: (   unload-truck obj12 tru1 apt1) [1.00]
07: (   unload-truck obj13 tru1 apt1) [1.00]
08: (  load-airplane obj13 apn1 apt1) [1.00]
09: (    fly-airplane apn1 apt1 apt2) [1.00]
10: (unload-airplane obj13 apn1 apt2) [1.00]
11: (     load-truck obj13 tru2 apt2) [1.00]
12: (drive-truck tru2 apt2 pos2 cit2) [1.00]
13: (   unload-truck obj13 tru2 pos2) [1.00]`,
      },
    ],
  },
  {
    id: "d",
    name: "Depots",
    interpretation: JSON.stringify(depot),
    domain: `(define (domain Depot)
(:requirements :typing)
(:types place locatable - object
  depot distributor - place
        truck hoist surface - locatable
        pallet crate - surface)

(:predicates (at ?x - locatable ?y - place) 
              (on ?x - crate ?y - surface)
              (in ?x - crate ?y - truck)
              (lifting ?x - hoist ?y - crate)
              (available ?x - hoist)
              (clear ?x - surface))
  
(:action Drive
:parameters (?x - truck ?y - place ?z - place) 
:precondition (and (at ?x ?y))
:effect (and (not (at ?x ?y)) (at ?x ?z)))

(:action Lift
:parameters (?x - hoist ?y - crate ?z - surface ?p - place)
:precondition (and (at ?x ?p) (available ?x) (at ?y ?p) (on ?y ?z) (clear ?y))
:effect (and (not (at ?y ?p)) (lifting ?x ?y) (not (clear ?y)) (not (available ?x)) 
              (clear ?z) (not (on ?y ?z))))

(:action Drop 
:parameters (?x - hoist ?y - crate ?z - surface ?p - place)
:precondition (and (at ?x ?p) (at ?z ?p) (clear ?z) (lifting ?x ?y))
:effect (and (available ?x) (not (lifting ?x ?y)) (at ?y ?p) (not (clear ?z)) (clear ?y)
    (on ?y ?z)))

(:action Load
:parameters (?x - hoist ?y - crate ?z - truck ?p - place)
:precondition (and (at ?x ?p) (at ?z ?p) (lifting ?x ?y))
:effect (and (not (lifting ?x ?y)) (in ?y ?z) (available ?x)))

(:action Unload 
:parameters (?x - hoist ?y - crate ?z - truck ?p - place)
:precondition (and (at ?x ?p) (at ?z ?p) (available ?x) (in ?y ?z))
:effect (and (not (in ?y ?z)) (not (available ?x)) (lifting ?x ?y)))

)
`,
    plans: [
      {
        problem: `(define (problem depotprob1818) (:domain Depot)
(:objects
  depot0 - Depot
  distributor0 distributor1 - Distributor
  truck0 truck1 - Truck
  pallet0 pallet1 pallet2 - Pallet
  crate0 crate1 - Crate
  hoist0 hoist1 hoist2 - Hoist)
(:init
  (at pallet0 depot0)
  (clear crate1)
  (at pallet1 distributor0)
  (clear crate0)
  (at pallet2 distributor1)
  (clear pallet2)
  (at truck0 distributor1)
  (at truck1 depot0)
  (at hoist0 depot0)
  (available hoist0)
  (at hoist1 distributor0)
  (available hoist1)
  (at hoist2 distributor1)
  (available hoist2)
  (at crate0 distributor0)
  (on crate0 pallet1)
  (at crate1 depot0)
  (on crate1 pallet0)
)

(:goal (and
    (on crate0 pallet2)
    (on crate1 pallet1)
  )
))
`,
        result: `00: ( lift hoist1 crate0 pallet1 distributor0) [1.00]
01: (  drive truck0 distributor1 distributor0) [1.00]
02: (  load hoist1 crate0 truck0 distributor0) [1.00]
03: (       lift hoist0 crate1 pallet0 depot0) [1.00]
04: (  drive truck0 distributor0 distributor1) [1.00]
05: (unload hoist2 crate0 truck0 distributor1) [1.00]
06: ( drop hoist2 crate0 pallet2 distributor1) [1.00]
07: (        load hoist0 crate1 truck1 depot0) [1.00]
08: (        drive truck1 depot0 distributor0) [1.00]
09: (unload hoist1 crate1 truck1 distributor0) [1.00]
10: ( drop hoist1 crate1 pallet1 distributor0) [1.00]`,
      },
    ],
  },
];
