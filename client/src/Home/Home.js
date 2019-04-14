import React, { Component } from 'react';
import {
  Grid,
  Toolbar,
  Column,
  SearchField,
  Container,
  Dialog,
  Button,
  WidgetCell,
  FormPanel,
  FieldSet,
  TextField,
  SelectField,
} from '@sencha/ext-modern';

export default class Home extends Component {
  constructor(props) {
    super(props);

    Ext.define('Office', {
      extend: 'Ext.data.Model',
      fields: ['id', 'name'],
      proxy: {
        type: 'rest',
        url: '/offices',
      },
    });

    Ext.define('Publisher', {
      extend: 'Ext.data.Model',
      fields: ['id', 'name'],
      proxy: {
        type: 'rest',
        url: '/publishers',
      },
    });

    Ext.define('User', {
      extend: 'Ext.data.Model',
      fields: ['id', 'first_name', 'last_name', 'publisher', 'office'],
      proxy: {
        type: 'rest',
        url: '/users',
      },
    });

    this.usersStore = Ext.create('Ext.data.Store', {
      model: 'User',
      proxy: {
        type: 'rest',
        url: 'api/users',
        reader: {
          type: 'json',
          rootProperty: 'records',
          totalProperty: 'total',
          successProperty: 'success',
        },
      },
      autoLoad: true,
    });

    this.officesStore = Ext.create('Ext.data.Store', {
      model: 'Office',
      proxy: {
        type: 'rest',
        url: 'api/offices',
        reader: {
          type: 'json',
          rootProperty: 'records',
          totalProperty: 'total',
          successProperty: 'success',
        },
      },
      autoLoad: true,
    });

    this.publishersStore = Ext.create('Ext.data.Store', {
      model: 'Publisher',
      proxy: {
        type: 'rest',
        url: 'api/publishers',
        reader: {
          type: 'json',
          rootProperty: 'records',
          totalProperty: 'total',
          successProperty: 'success',
        },
      },
      listeners: {
        load(store) {
          const emptyRecord = { value: '', name: '-' };

          store.insert(0, emptyRecord);
        },
      },
      autoLoad: true,
    });

    this.state = {
      showDialog: false,
      isEdit: false,
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  showDialog = (button, isEdit = false) => {
    const form = this.form.cmp;

    form.reset(true);

    if (isEdit) {
      const gridRow = button.up('gridrow');
      const record = gridRow.getRecord();

      form.setValues({
        ...record.data,
        office: record.data.office.id,
        publisher: record.data.publisher ? record.data.publisher.id : null,
      });
    }

    this.setState({ showDialog: true, isEdit });
  };

  onFormSubmit() {
    const form = this.form.cmp;
    const isFormValid = form.validate();

    if (!isFormValid) {
      return;
    }

    const formValues = { ...form.getValues() };

    formValues.office = this.officesStore.findRecord('id', formValues.office).data;

    if (formValues.publisher) {
      formValues.publisher = this.officesStore.findRecord('id', formValues.publisher).data;
    }

    this.usersStore.add(formValues);
    this.usersStore.sync();

    this.setState({ showDialog: false, isEdit: false });
  }

  onCancel = () => {
    this.setState({ showDialog: false, isEdit: false });
  };

  deleteHandler = button => {
    const gridRow = button.up('gridrow');
    const record = gridRow.getRecord();

    this.usersStore.remove(record);
    this.usersStore.sync();
  };

  onSearch = () => {
    const query = this.query.cmp.getValue().toLowerCase();

    this.usersStore.clearFilter();

    if (query.length)
      this.usersStore.filterBy(record => {
        const { first_name, last_name, publisher, office } = record.data;

        return (
          first_name.toLowerCase().indexOf(query) !== -1 ||
          last_name.toLowerCase().indexOf(query) !== -1 ||
          `${office}`.toLowerCase().indexOf(query) !== -1 ||
          `${publisher}`.toLowerCase().indexOf(query) !== -1
        );
      });
  };

  render() {
    const { showDialog } = this.state;

    return (
      <Container layout="vbox" padding="20">
        <Container
          layout={{
            type: 'hbox',
            pack: 'right',
          }}
          padding="20 0"
        >
          <Button text="Add" ui="action raised" handler={button => this.showDialog(button)} />
        </Container>
        <Grid store={this.usersStore} flex={2} emptyText="No items...">
          <Toolbar docked="top">
            <SearchField
              ui="faded"
              ref={field => (this.query = field)}
              placeholder="Search..."
              onChange={this.onSearch.bind(this)}
            />
          </Toolbar>
          <Column text="First name" dataIndex="first_name" flex={2} resizable />
          <Column text="Last name" dataIndex="last_name" flex={3} resizable />
          <Column text="Office" xtype="templatecolumn" tpl="{office.name}" flex={2} resizable />
          <Column text="Publisher" xtype="templatecolumn" tpl="{publisher.name}" flex={2} resizable />
          <Column resizable>
            <WidgetCell align="center">
              <Button ui="round action" text="E" handler={button => this.showDialog(button, true)} />
            </WidgetCell>
          </Column>
          <Column resizable>
            <WidgetCell align="center">
              <Button ui="round decline" text="X" handler={this.deleteHandler} />
            </WidgetCell>
          </Column>
        </Grid>
        <Dialog
          displayed={showDialog}
          modal
          centered
          title="Employee"
          closable
          closeAction="hide"
          bodyPadding="20"
          minWidth="600"
          defaultFocus="#submit"
          maskTapHandler={this.onCancel}
          onHide={this.onCancel}
        >
          <FormPanel ref={form => (this.form = form)} shadow padding="20">
            <FieldSet title="First name" margin="0 0 20 0">
              <TextField name="first_name" maxLength={20} required />
            </FieldSet>
            <FieldSet title="Last name" margin="0 0 20 0">
              <TextField name="last_name" maxLength={20} required />
            </FieldSet>
            <FieldSet title="Office" margin="0 0 20 0">
              <SelectField
                name="office"
                autoSelect
                store={this.officesStore}
                displayField="name"
                valueField="id"
                required
              />
            </FieldSet>
            <FieldSet title="Publisher">
              <SelectField name="publisher" store={this.publishersStore} displayField="name" valueField="id" />
            </FieldSet>
            <TextField name="id" hidden />
          </FormPanel>
          <Button text="Cancel" handler={this.onCancel} />
          <Button itemId="submit" text="Submit" handler={this.onFormSubmit} />
        </Dialog>
      </Container>
    );
  }
}
