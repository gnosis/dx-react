import React, { Component } from 'react'
import { reduxForm, Field, FieldArray } from 'redux-form'
import Input from 'components/FormInput'
import { add0xPrefix } from '../../utils/helpers'

import FormInput from 'components/FormInput'


import './settings.less'


class Settings extends Component {

  renderForm() {
    const { handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <FieldArray name="settings" component={renderSettings} />
          </div>
        </div>
      </form>
    )
  }

  render() {
    return (
      <div className="settingsPage">
        <div className="settingsPage__header">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1>Application Settings</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container settingsSection">
          <div className="row">
            <div className="col-xs-12">
              <div className="settingsHeading settingsHeading__icon">
                <div className="settingsGeneral__icon icon icon--gear" />
              </div>
              <h2 className="settingsHeading settingsHeading__title">General</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-1 col-md-7">
              <Field name="title" component={FormInput} type="text" label="Title" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-1 col-md-7">
              <Field name="description" component={FormInput} type="text" label="Description" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-1 col-md-7">
              <Field name="domain" component={FormInput} type="text" label="Domain" />
            </div>
          </div>
        </div>
        <div className="container settingsSection">
          <div className="row">
            <div className="col-xs-12">
              <div className="settingsHeading settingsHeading__icon">
                <div className="settingsModerators__icon icon icon--user" />
              </div>
              <h2 className="settingsHeading settingsHeading__title">Moderators</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-xs-offset-1 col-sm-10 col-sm-offset-1">
              <div className="moderatorsList">
                {this.renderForm()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const renderSettings = ({ fields, meta: { error } }) =>

  <div className="row">
    <div className="col-xs-12">
      <button type="button" onClick={() => fields.push({ address: '', name: '' })} className="btn btn-default">
        {fields.getAll() && fields.getAll().length > 0 ? 'ADD ANOTHER' : 'ADD'}
      </button>
      <div />
      {fields.map((item, index) =>
        <div className="row moderatorItem" key={index}>
          <div className="col-xs-12 col-sm-8">
            <h4>
              Moderator #{index + 1}
            </h4>
            <Field
              name={`${item}.name`}
              type="text"
              component={Input}
              label="NAME"
              placeholder="George"
            />
            <Field
              name={`${item}.address`}
              type="text"
              component={Input}
              label="ADDRESS"
              placeholder="0x12e87B8CE41184E0688027f370A972A436ABE34e"
              normalize={add0xPrefix}
            />
            <button
              className="btn btn-default"
              type="button"
              title="Remove"
              onClick={() => fields.remove(index)}
            >
              Remove
            </button>
          </div>
        </div>,
      )}
      {fields.getAll() && fields.getAll().length > 0 ?
        <div className="row">
          <div className="col-md-4">
            <button type="submit" className="btn btn-default">
              Save
            </button>
          </div>
        </div>
        : <div />
      }
    </div>
  </div>

const validate = (values) => {
  const errors = {}
  const settingsErrors = []
  values.settings.forEach((item, index) => {
    const error = {}
    // Name errors
    if (!item.name || item.name.length < 3) {
      error.name = 'Required'
      settingsErrors[index] = error
    }
    const occurrences = values.settings.filter(other => item.address == other.address)
    // Value Errors
    if (occurrences.length > 1) {
      error.address = 'Duplicated Address'
      settingsErrors[index] = error
    } else if (!item.address) {
      error.address = 'Required'
      settingsErrors[index] = error
    } else if (item.address.length != 42) {
      error.address = 'Invalid Ethereum address'
      settingsErrors[index] = error
    }
  })

  if (settingsErrors.length > 0) {
    errors.settings = settingsErrors
  }
  return errors
}


const form = {
  form: 'settingsForm',
  asyncBlurFields: [],
  validate,
}

export default reduxForm(form)(Settings)
