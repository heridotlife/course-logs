import * as esbuild from 'esbuild';
import { watch } from 'fs';

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/app.js'],
  bundle: true,
  outfile: 'dist/app.js',
  format: 'iife',
  minify: !isWatch,
  sourcemap: isWatch,
  target: 'es2020',
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('👀 Watching for changes...');
    } else {
      await esbuild.build(buildOptions);
      console.log('✅ Build complete!');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
