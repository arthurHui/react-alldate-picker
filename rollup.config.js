import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import postcss  from "rollup-plugin-postcss";

export default [
  {
    input: './src/index.js',
    output: [
      {
        file: './dist/index.js',
        format: 'cjs',
      },
      {
        file: './dist/index.es.js',
        format: 'es',
        exports: 'named',
      }
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react']
      }),
      postcss({
        extract: true,
        minimize: true,
      }),
      external({
        includeDependencies: true
      }),
      resolve(),
      terser(),
    ]
  }
];