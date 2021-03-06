import { transformFileSync } from "babel-core";
import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import plugin from '../src/index';
import expect from 'expect';

describe('index', () => {

  afterEach(() => {
    global.__clearBabelAntdPlugin();
  });

  const fixturesDir = join(__dirname, 'fixtures');
  let fixtures = readdirSync(fixturesDir);
  const onlyFixtures = fixtures.filter(fixture => fixture.indexOf('-only') > -1);

  if (onlyFixtures.length) {
    fixtures = onlyFixtures;
  }

  fixtures.map(caseName => {
    const fixtureDir = join(fixturesDir, caseName);
    const actualFile = join(fixtureDir, 'actual.js');
    const expectedFile = join(fixtureDir, 'expected.js');

    it(`should work with ${caseName.split('-').join(' ')}`, () => {
      let pluginWithOpts;
      caseName = caseName.replace(/-only$/, '');
      if (caseName === 'import-css') {
        pluginWithOpts = [
          plugin, { libraryName: 'antd', style: true }
        ];
      } else if (caseName === 'material-ui') {
        pluginWithOpts = [
          plugin, [
            { libraryName: 'material-ui', libraryDirectory: '', camel2DashComponentName: false },
          ]
        ];
      } else if (caseName === 'react-toolbox') {
        pluginWithOpts = [
          plugin, [
            { libraryName: 'react-toolbox', camel2UnderlineComponentName: true },
          ]
        ];
      } else if (caseName === 'multiple-libraries') {
        pluginWithOpts = [
          plugin, [
            { libraryName: 'antd' },
            { libraryName: 'antd-mobile' },
          ]
        ];
      } else {
        pluginWithOpts = [
          plugin, { libraryName: 'antd' }
        ];
      }

      const actual = transformFileSync(actualFile, {
        presets: ['react'],
        plugins: [pluginWithOpts || plugin],
      }).code;

      if (onlyFixtures.length) {
        console.warn();
        console.warn(actual);
      }

      const expected = readFileSync(expectedFile, 'utf-8');
      expect(actual.trim()).toEqual(expected.trim());
    });
  });

  xit(`tmp`, () => {
    const actualFile = join(fixturesDir, `variable-declaration/actual.js`);
    const actual = transformFileSync(actualFile, {
      presets: ['react'],
      plugins: [plugin],
    }).code;
    console.log(actual);
  });
});
