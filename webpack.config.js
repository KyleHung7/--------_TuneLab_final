module: {
  rules: [
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: sass,
            sassOptions: {
              // your options here
            }
          }
        }
      ]
    }
  ]
} 