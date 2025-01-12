import React from "react";
import { Card } from 'primereact/card';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

const TemplateSelector = ({ setTemplate }) => {
  const [visible, setVisible] = React.useState(true);

  const templates = [
    {
      id: 'template1',
      name: 'Modern Clean',
      image: '/templates/template1.png',
      description: 'A clean and modern resume template'
    },
    {
      id: 'template2',
      name: 'Professional Classic',
      image: '/templates/template2.png',
      description: 'Traditional professional layout'
    },
    {
      id: 'template3',
      name: 'Creative Bold',
      image: '/templates/template3.png',
      description: 'Stand out with this creative design'
    }
  ];

  return (
    <>
      <Button
        icon="pi pi-bars"
        onClick={() => setVisible(true)}
        className="fixed top-50 left-0 z-5"
      />

      <Sidebar
        visible={visible}
        position="left"
        onHide={() => setVisible(false)}
        className="w-full md:w-20rem lg:w-24rem"
      >
        <h2 className="text-xl font-bold mb-4">Choose Template</h2>
        <div className="grid">
          {templates.map((template) => (
            <div key={template.id} className="col-12 mb-3">
              <Card
                className={`cursor-pointer transition-all transition-duration-200
                  hover:shadow-4 ${template.id === 'template1' ? 'border-primary' : ''}`}
                onClick={() => setTemplate(template.id)}
              >
                <div className="flex align-items-center">
                  <div className="w-8rem h-8rem border-round overflow-hidden mr-3">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src='https://via.placeholder.com/150'}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-500">{template.description}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Sidebar>
    </>
  );
};

export default TemplateSelector;
