from app import add, subtract, multiply, divide
import pytest

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0

def test_subtract():
    assert subtract(10, 4) == 6
    assert subtract(0, 0) == 0

def test_multiply():
    assert multiply(5, 6) == 30
    assert multiply(0, 100) == 0

def test_divide():
    assert divide(8, 2) == 4.0
    assert divide(9, 3) == 3.0

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(1, 0)
