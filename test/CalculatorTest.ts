import { Calculator } from './../src/Calculator';
import { expect } from 'chai';


describe('CalculatorTest', () => {

    it('addition should work properly', () => {
        let calculator = new Calculator(4, 3);
        expect(calculator.add()).to.equal(7);
    });
});