import { expect } from 'chai';

import { Calculator } from '../src/Calculator'

describe('CalculatorTest', () => {

    it('addition should work properly', () => {
        let calculator = new Calculator(4, 3);
        expect(calculator.add()).to.equal(7);
    });
});