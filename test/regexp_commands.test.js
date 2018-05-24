const
    assert = require('assert');

const
    regexp_commands = require('../user_commands/utils/regexp_commands');

describe('Check regexps', function() {
    describe('check start regexp', function() {
        it('(/start) must be true', function() {
            assert.equal(regexp_commands.startRegexp.test('/start'), true);
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
});
