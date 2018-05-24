const
    assert = require('assert');

const
    regexp_commands = require('../user_commands/utils/regexp_commands');

describe('Check regexps', function() {
    describe('check start regexp', function() {
        it('/start must be true', function() {
            assert.equal(regexp_commands.startRegexp.test('/start'), true);
        });
    });
});
