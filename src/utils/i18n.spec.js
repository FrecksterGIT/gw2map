/* eslint-env mocha */

import I18N from './i18n';

describe('I18N', function() {
	before(function() {
		I18N.init({
			lng: 'en',
			resources: {
				en: {
					namespace1: {
						text1: 'text 1.1',
						text2: 'text 1.2'
					},
					namespace2: {
						text1: 'text 2.1',
						text2: 'text 2.2'
					}
				}
			}
		});
	});
	it('known keys resolve correctly', function() {
		I18N.t('namespace1:text1').should.equal('text 1.1');
		I18N.t('namespace2:text2').should.equal('text 2.2');
	});
	it('unknown key should return the unaltered key', function() {
		I18N.t('namespace3:text1').should.equal('namespace3:text1');
	});
});
