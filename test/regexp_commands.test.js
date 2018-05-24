const
    assert = require('assert');

const
    regexp_commands = require('../user_commands/utils/regexp_commands');

describe('Check regexps', function() {
    describe('check start regexp', function() {
        it('(/start) must be true', function() {
            assert.equal(regexp_commands.startRegexp.test('/start'), true);
        });
        it('(/start   ) must be true', function() {
            assert.equal(regexp_commands.startRegexp.test('/start  '), true);
        });
        it('(/start 213) must be true', function() {
            assert.equal(regexp_commands.startRegexp.test('/start 123'), true);
        });

        it('(/starsdf) must be false', function() {
            assert.equal(regexp_commands.startRegexp.test('/starsdf'), false);
        });
        it('(/starsdf 123) must be false', function() {
            assert.equal(regexp_commands.startRegexp.test('/starsdf 123'), false);
        });
    });
    describe('check help regexp', function() {
        it('(/help) must be true', function() {
            assert.equal(regexp_commands.helpRegexp.test('/help'), true);
        });
        it('(/help   ) must be true', function() {
            assert.equal(regexp_commands.helpRegexp.test('/help   '), true);
        });
        it('(/help 213) must be true', function() {
            assert.equal(regexp_commands.helpRegexp.test('/help 123'), true);
        });

        it('(/helsdf) must be false', function() {
            assert.equal(regexp_commands.helpRegexp.test('/helsdf'), false);
        });
        it('(/helsdf 123) must be false', function() {
            assert.equal(regexp_commands.helpRegexp.test('/helsdf 123'), false);
        });
    });
    describe('check sendhomework regexp', function() {
        it('(/sendhomework) must be true', function() {
            assert.equal(regexp_commands.sendhomeworkRegexp.test('/sendhomework'), true);
        });
        it('(/sendhomework   ) must be true', function() {
            assert.equal(regexp_commands.sendhomeworkRegexp.test('/sendhomework   '), true);
        });
        it('(/sendhomework 213) must be true', function() {
            assert.equal(regexp_commands.sendhomeworkRegexp.test('/sendhomework 123'), true);
        });

        it('(/setefresdf) must be false', function() {
            assert.equal(regexp_commands.sendhomeworkRegexp.test('/sdfdsffdssdf'), false);
        });
        it('(/sendhomeworksdf 123) must be false', function() {
            assert.equal(regexp_commands.sendhomeworkRegexp.test('/sdsfsfsdf 123'), false);
        });
    });
});
