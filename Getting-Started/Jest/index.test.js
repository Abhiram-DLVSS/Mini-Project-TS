test('Testing', () => {
    expect(2 + 2).toBe(4);

    let data = {one: 1};
    data['two'] = 2;
    
    //Used to test whether the object is the exactly the same or not- better to use toBe only with strings, numbers and booleans
    expect(data).not.toBe({one: 1, two: 2});
    expect(data).toEqual({one: 1, two: 2});

    data = [1,'a',undefined];
    expect(data).toEqual([1,'a']);//doesn't take undefined into account

    data = [1,'a',undefined];
    expect(data).not.toStrictEqual([1,'a']);

    expect(data).toContain('a');
    expect(data).not.toContain('b');

    data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});

    data=null
    expect(data).toBeNull();
    data=undefined
    expect(data).not.toBeDefined();
    expect(data).toBeUndefined();
    data=0
    expect(data).not.toBeTruthy();
    expect(data).toBeFalsy();

    expect(data).toBeGreaterThan(-1);
    expect(data).toBeGreaterThanOrEqual(0);
    expect(data).toBeLessThan(1);
    expect(data).not.toBeLessThanOrEqual(-1);

    // Regex
    data="1234567890"
    expect(data).toMatch(/^[1-9][0-9]{9}$/);
    data="12345678901"
    expect(data).not.toMatch(/^[1-9][0-9]{9}$/);
});