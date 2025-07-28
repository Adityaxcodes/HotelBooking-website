import React from 'react'
import PropTypes from 'prop-types'

const Title = ({ title, subTitle, align, font}) => {
  return (
    <div className={`space-y-3 ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}>
      <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 font-playfair`}>
        {title}
      </h2>
      {subTitle && (
        <div className={`${align === 'center' ? 'mx-auto' : ''}`} style={{ maxWidth: '60vw' }}>
          <p className="text-sm text-indigo-600 font-medium uppercase tracking-wider">
            {subTitle}
          </p>
        </div>
      )}
    </div>
  );
};

export default Title;
