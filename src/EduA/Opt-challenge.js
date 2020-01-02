const Spec = `
Opt-Challenge w wersji dla modelu Edu A.
Autor: Tomasz Primke
Wersja: 1

-- Products     id, name
1,      raw a
2,      prod a
3,      sold a
4,      raw b
5,      prod b
6,      prod c
7,      prod d
8,      sold d
9,      prod e
10,     sold e

-- Actions      id, name, buffer_id
1,      buy a,          1
2,      sell a,         2
3,      buy b,          1
4,      sell d,         2
5,      sell e,         2
6,		  expenses,		    1

-- ActionsReqsResults   action_id, req_or_res, type, ref_id, qty
1,      req,    asset,          1,10
1,      res,    product,        1,1
2,      req,    product,        2,1
2,      res,    product,        3,1
2,      res,    asset,          1,40
3,      req,    asset,          1,10
3,      res,    product,        4,1
4,      req,    product,        7,1
4,      res,    product,        8,1
4,      res,    asset,          1,30
5,      req,    product,        9,1
5,      res,    product,        10,1
5,      res,    asset,          1,60
6,		  req,	  asset,			    1,2400

-- Operations   id, name
1,      make a
2,      make b
3,      make c
4,      make d
5,      make e

-- OperationsReqsResults operation_id, req_or_res, type, ref_id, qty
1,      req,product,1,1
1,      res,product,2,1
2,      req,product,4,1
2,      res,product,5,1
3,      req,product,5,1
3,      res,product,6,1
4,      req,product,6,1
4,      res,product,7,1
5,      req,product,2,1
5,      req,product,7,1
5,      res,product,9,1

-- OperationsSet        id, name
1,      mode a
2,      mode b
3,      mode c
4,      mode d
5,      mode e

-- OperationsSetOperations      set_id, operation_id, operation_time
1,      1,      28
2,      2,      10
3,      3,      6
4,      4,      12
5,      5,      25

-- Machines     id, name
1,      machine for a
2,      machine for b
3,      machine for c
4,      machine for d
5,      machine for e

-- MachineModes         machine_id, set_id, setup_time
1,      1,      240
2,      2,      120
3,      3,      360
4,      4,      360
5,      5,      180

-- MachineResources     machine_id, resource_id, required
1,      1,      1
2,      2,      1
3,      1,      1
4,      2,      1
5,      3,      1

-- MachineModeResources machine_id, set_id, resource_id, required

-- Resources id, name, available, operation_time
1,      red,    1,0
2,      green,  1,0
3,      yellow, 1,0

-- Events       id, name, type, start_at, period
1,      week,   cyclic, 0,2400

-- Buffers      id, name
1,      main input
2,      main output
3,      wst a
4,      wst b
5,      wst c
6,      wst d
7,      wst e

-- BufferProducts       buffer_id, product_id, qty

-- Workstations         id, name, buffer_id, machine_id, machine_mode, target_id, status, timer
1, Workstation A,       3,1,    null,null,not ready,null
2, Workstation B,       4,2,    null,null,not ready,null
3, Workstation C,       5,3,    null,null,not ready,null
4, Workstation D,       6,4,    null,null,not ready,null
5, Workstation E,       7,5,    null,null,not ready,null

-- Connections  id, from_buffer, to_buffer
1,      1,      3
2,      3,      2
3,      1,      4
4,      4,      5
5,      5,      6
6,      6,      2
7,      3,      7
8,      6,      7
9,      7,      2

-- ConnectionConstraints        connection_id, product_id
1,      1
2,      2
3,      4
4,      5
5,      6
6,      7
7,      2
8,      7
9,      9

-- Assets       id, name, initial, value
1,      money,  1500




Ciekawostki:
  # Na końcu systemu jest jeden bufor wyjściowy.
    Równie dobrze można użyć więcej buforów (po jednym na każdy typ sprzedawanego produktu).
    Podobna uwaga dotyczy bufora wejściowego.

  # Bufor wejściowy w ogóle jest zbędny - przedmioty początkowe można kupować bezpośrednio do buforów związanych ze stacjami roboczymi.
    Bufor wejściowy wprowadzono po to, aby system rozpoczynał i kończył się specjalnymi buforami.

  # Wprowadzono odrębne typy maszyn dla każdej stacji roboczej. Równie dobrze można zastosować jeden typ maszyny, zdolnej do produkcji każdego produktu (tylko w innym trybie). Wówczas przezbrojenie stacji roboczej oznaczałoby ustawienie tej maszyny w odpowiedni tryb pracy (dla każdej stacji byłby wykorzystywany tylko jeden tryb pracy, pozostałe nie byłyby używane).


`;


export default Spec;