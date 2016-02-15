using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Data.SqlClient;

namespace Helpers
{
    public static class DBHelper
    {
#if DEBUG
        private static string defaultConnectionString = ""; // Don't show the world our db connection string. :) TODO: Find a way to put it make it an environment variable.
#else
        private static string defaultConnectionString = "";
#endif
        public static string DefaultConnectionString
        {
            get
            {
                return defaultConnectionString;
            }
            set
            {
                defaultConnectionString = value;
            }
        }

        public static string BuildConnectionString(string initialCatalog)
        {
            return "Data Source=" + PrivateDbConnectionStrings.dataSource + ";Initial Catalog=" + initialCatalog +
                    ";User Id=" + PrivateDbConnectionStrings.userId + ";password=" + PrivateDbConnectionStrings.password;
        }

        public static string BuildConnectionString()
        {
            return "Data Source=" + PrivateDbConnectionStrings.dataSource + ";Initial Catalog=AnimalShelter" +
                    ";User Id=" + PrivateDbConnectionStrings.userId + ";password=" + PrivateDbConnectionStrings.password;
        }

        public static string GetParameterForQuery(object parameter)
        {
            if (parameter is string) {
                return "'" + parameter + "'";
            } else {
                return "" + (int)parameter;
            }
        }

        public static DataTable ExecuteProcedure(string connectionqString, string PROC_NAME, params object[] parameters)
        {
            try
            {
                defaultConnectionString = connectionqString;
                if (parameters.Length % 2 != 0)
                    throw new ArgumentException("Wrong number of parameters sent to procedure. Expected an even number.");
                DataTable a = new DataTable();
                List<SqlParameter> filters = new List<SqlParameter>();

                string query = "EXEC " + PROC_NAME;

                bool first = true;
                for (int i = 0; i < parameters.Length; i += 2)
                {
                    query += (first ? " " : ", ") + GetParameterForQuery(parameters[i]);
                    first = false;
                }

                a = Query(query, filters);
                return a;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static DataTable ExecuteQuery(string connectionqString, string query, params object[] parameters)
        {
            try
            {
                defaultConnectionString = connectionqString;
                if (parameters.Length % 2 != 0)
                    throw new ArgumentException("Wrong number of parameters sent to procedure. Expected an even number.");
                DataTable a = new DataTable();
                List<SqlParameter> filters = new List<SqlParameter>();

                for (int i = 0; i < parameters.Length; i += 2)
                    filters.Add(new SqlParameter(parameters[i] as string, parameters[i + 1]));

                a = Query(query, filters);
                return a;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static int ExecuteNonQuery(string connectionqString, string query, params object[] parameters)
        {
            try
            {
                defaultConnectionString = connectionqString;
                if (parameters.Length % 2 != 0)
                    throw new ArgumentException("Wrong number of parameters sent to procedure. Expected an even number.");
                List<SqlParameter> filters = new List<SqlParameter>();

                for (int i = 0; i < parameters.Length; i += 2)
                    filters.Add(new SqlParameter(parameters[i] as string, parameters[i + 1]));
                return NonQuery(query, filters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static object ExecuteScalar(string connectionqString, string query, params object[] parameters)
        {
            try
            {
                defaultConnectionString = connectionqString;
                if (parameters.Length % 2 != 0)
                    throw new ArgumentException("Wrong number of parameters sent to query. Expected an even number.");
                List<SqlParameter> filters = new List<SqlParameter>();

                for (int i = 0; i < parameters.Length; i += 2)
                    filters.Add(new SqlParameter(parameters[i] as string, parameters[i + 1]));
                return Scalar(query, filters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #region Private Methods

        private static DataTable Query(String consulta, IList<SqlParameter> parametros)
        {
            try
            {
                DataTable dt = new DataTable();
                SqlConnection connection = new SqlConnection(defaultConnectionString);
                SqlCommand command = new SqlCommand();
                SqlDataAdapter da;
                try
                {
                    command.Connection = connection;
                    command.CommandText = consulta;
                    if (parametros != null)
                    {
                        command.Parameters.AddRange(parametros.ToArray());
                    }
                    da = new SqlDataAdapter(command);
                    da.Fill(dt);
                }
                finally
                {
                    if (connection != null)
                        connection.Close();
                }
                return dt;
            }
            catch (Exception)
            {
                throw;
            }

        }

        private static int NonQuery(string query, IList<SqlParameter> parametros)
        {
            try
            {
                DataSet dt = new DataSet();
                SqlConnection connection = new SqlConnection(defaultConnectionString);
                SqlCommand command = new SqlCommand();

                try
                {
                    connection.Open();
                    command.Connection = connection;
                    command.CommandText = query;
                    command.Parameters.AddRange(parametros.ToArray());
                    return command.ExecuteNonQuery();

                }
                finally
                {
                    if (connection != null)
                        connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static object Scalar(string query, List<SqlParameter> parametros)
        {
            try
            {
                DataSet dt = new DataSet();
                SqlConnection connection = new SqlConnection(defaultConnectionString);
                SqlCommand command = new SqlCommand();

                try
                {
                    connection.Open();
                    command.Connection = connection;
                    command.CommandText = query;
                    command.Parameters.AddRange(parametros.ToArray());
                    return command.ExecuteScalar();

                }
                finally
                {
                    if (connection != null)
                        connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion
    }

}
