(module
  (type (;0;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;1;) (func (param i32)))
  (type (;2;) (func (param i32 i32 i32) (result i32)))
  (type (;3;) (func (param i32) (result i32)))
  (type (;4;) (func))
  (import "wasi_snapshot_preview1" "fd_write" (func (;0;) (type 0)))
  (func (;1;) (type 1) (param i32)
    i32.const 12
    i32.const 0
    i32.store
    i32.const 1
    i32.const 4
    i32.store
    local.get 0
    i32.const 12
    i32.store
    i32.const 8
    i32.const 1
    i32.const 0
    i32.const 1
    call 0
    drop)
  (func (;2;) (type 1) (param i32)
    local.get 0
    i32.const 0
    i32.lt_s
    if  ;; label = @1
      i32.const 45
      call 1
      i32.const 0
      local.get 0
      i32.sub
      call 2
    else
      local.get 0
      i32.const 10
      i32.lt_s
      if  ;; label = @2
        i32.const 48
        local.get 0
        i32.add
        call 1
      else
        local.get 0
        i32.const 10
        i32.div_s
        call 2
        local.get 0
        i32.const 10
        i32.rem_s
        call 2
      end
    end)
  (func (;3;) (type 2) (param i32 i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.le_s
    if (result i32)  ;; label = @1
      local.get 0
      i32.const 3
      i32.rem_s
      i32.const 0
      i32.eq
      local.get 0
      i32.const 5
      i32.rem_s
      i32.const 0
      i32.eq
      i32.or
      if (result i32)  ;; label = @2
        local.get 2
        local.get 0
        i32.add
      else
        local.get 2
      end
      local.get 1
      local.get 0
      i32.const 1
      i32.add
      call 3
    else
      local.get 2
    end)
  (func (;4;) (type 3) (param i32) (result i32)
    i32.const 0
    local.get 0
    i32.const 1
    i32.sub
    i32.const 1
    call 3)
  (func (;5;) (type 4)
    i32.const -5
    call 2
    i32.const 10
    call 4
    call 2)
  (memory (;0;) 1)
  (export "memory" (memory 0))
  (export "_start" (func 5)))
